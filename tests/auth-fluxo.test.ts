import assert from "node:assert/strict";
import test from "node:test";
import { loadIsolated } from "./helpers/isolated";

// Fluxo completo de lib/auth com o servidor de login simulado (sem rede).
test("login, callback, sessão em partes, renovação no proxy e logout", async () => {
  const anterior = { ...process.env };
  Object.assign(process.env, {
    APP_BASE_URL: "https://site.test",
    OIDC_ISSUER: "https://login.test",
    OIDC_CLIENT_ID: "cid",
    OIDC_CLIENT_SECRET: "segredo",
    OIDC_AUDIENCE: "123",
    SESSION_SECRET: "ab".repeat(32),
  });
  try {
    const { NextRequest } = await import("next/server");
    const chamadas: Array<[string, ...unknown[]]> = [];
    const tokens = (access: string, expiresIn: number, refresh?: string) => ({
      access_token: access,
      id_token: "i".repeat(1500),
      refresh_token: refresh,
      expiresIn: () => expiresIn,
      claims: () => ({ sub: "auth0|6a0000000000000000000001", iss: "https://login.test" }),
    });
    const oidc = {
      discovery: async () => ({ serverMetadata: () => ({ issuer: "https://login.test" }) }),
      ClientSecretBasic: () => ({}),
      randomPKCECodeVerifier: () => "verifier",
      randomState: () => "estado",
      randomNonce: () => "nonce",
      calculatePKCECodeChallenge: async () => "desafio",
      buildAuthorizationUrl: (_c: unknown, p: Record<string, string>) => new URL(`https://login.test/oauth/v2/authorize?${new URLSearchParams(p)}`),
      authorizationCodeGrant: async (_c: unknown, url: URL, checks: unknown) => {
        chamadas.push(["code", url.href, checks]);
        return tokens("a".repeat(3000), 100, "rt1");
      },
      fetchUserInfo: async () => ({ email: "ana@x.com", email_verified: true, name: "Ana" }),
      refreshTokenGrant: async (_c: unknown, rt: string) => {
        chamadas.push(["refresh", rt]);
        await new Promise((r) => setTimeout(r, 5));
        return tokens("novo", 3600, "rt2");
      },
      tokenRevocation: async (_c: unknown, t: string, p: unknown) => void chamadas.push(["revoke", t, p]),
      buildEndSessionUrl: (_c: unknown, p: Record<string, string>) => new URL(`https://login.test/oidc/v1/end_session?${new URLSearchParams(p)}`),
    };
    const auth = loadIsolated("lib/auth/index.ts", {
      "server-only": {},
      jose: await import("jose"),
      "next/headers": { cookies: async () => { throw new Error("use req"); } },
      "openid-client": oidc,
      "./util": await import("../lib/auth/util"),
    }) as unknown as Record<string, (req?: unknown) => Promise<Response & { cookies: { getAll(): Array<{ name: string; value: string; maxAge?: number }> } }>>;
    const comCookies = (url: string, cs: Array<{ name: string; value: string }>) =>
      new NextRequest(url, { headers: { cookie: cs.map((c) => `${c.name}=${c.value}`).join("; ") } });

    // login
    const login = await auth.iniciarLogin(new NextRequest("http://interno:3001/api/auth/login?returnTo=%2Fperfil&prompt=create"));
    const destino = new URL(login.headers.get("location")!);
    assert.equal(destino.searchParams.get("redirect_uri"), "https://site.test/api/auth/callback");
    assert.equal(destino.searchParams.get("prompt"), "create");
    assert.equal(destino.searchParams.get("code_challenge_method"), "S256");
    assert.match(destino.searchParams.get("scope")!, /offline_access urn:zitadel:iam:org:project:id:123:aud urn:zitadel:iam:org:projects:roles$/);
    const tx = login.cookies.getAll().find((c) => c.name === "dadg_site_auth")!;
    assert.equal(tx.maxAge, 600);

    // callback sem a transação: página de erro, sem sessão
    assert.equal((await auth.concluirLogin(new NextRequest("http://interno:3001/api/auth/callback?code=x&state=estado"))).status, 400);

    // callback: URL pública, checagens e sessão em partes (com o cookie antigo do Auth0 apagado)
    const cb = await auth.concluirLogin(comCookies("http://interno:3001/api/auth/callback?code=x&state=estado", [tx, { name: "dadg_site_session", value: "auth0velho" }]));
    assert.equal(cb.headers.get("location"), "https://site.test/perfil");
    assert.deepEqual(chamadas[0], ["code", "https://site.test/api/auth/callback?code=x&state=estado", { pkceCodeVerifier: "verifier", expectedState: "estado", expectedNonce: "nonce", idTokenExpected: true }]);
    const gravados = cb.cookies.getAll();
    const partes = gravados.filter((c) => /^dadg_site_session\.\d$/.test(c.name));
    assert.ok(partes.length >= 2, "tokens grandes vão em várias partes");
    for (const p of partes) assert.ok(p.value.length <= 3600);
    assert.equal(gravados.find((c) => c.name === "dadg_site_session")?.maxAge, 0);
    assert.equal(gravados.find((c) => c.name === "dadg_site_auth")?.maxAge, 0);

    const sessao = await auth.getSession(comCookies("https://site.test/", partes)) as unknown as { user: Record<string, unknown> };
    assert.deepEqual(sessao.user, { sub: "auth0|6a0000000000000000000001", email: "ana@x.com", email_verified: true, name: "Ana" });
    assert.equal(await auth.getSession(comCookies("https://site.test/", partes.slice(1))), null, "parte faltando = sem sessão");

    // proxy: token vence em 100 s → renova uma vez só, mesmo com pedidos simultâneos
    const [r1, r2] = await Promise.all([
      auth.manterSessao(comCookies("https://site.test/perfil", partes)),
      auth.manterSessao(comCookies("https://site.test/eventos", partes)),
    ]);
    assert.equal(chamadas.filter((c) => c[0] === "refresh").length, 1);
    const renovados = r1.cookies.getAll().filter((c) => c.value && c.name.startsWith("dadg_site_session."));
    assert.equal(renovados.length, 1, "access token menor cabe numa parte");
    assert.deepEqual(r1.cookies.getAll().filter((c) => !c.value).map((c) => c.name), ["dadg_site_session.1"], "sobras apagadas");
    assert.ok(r1.headers.get("x-middleware-request-cookie")?.includes("dadg_site_session.0="), "a requisição atual já segue com a sessão nova");
    assert.equal(r2.cookies.getAll().length, renovados.length + 1);
    assert.equal((await auth.manterSessao(comCookies("https://site.test/api/auth/logout", partes))).cookies.getAll().length, 0, "não mexe nas rotas de login");

    // logout: revoga o refresh token novo, apaga tudo e sai do servidor de login
    const sair = await auth.sair(comCookies("https://site.test/api/auth/logout", renovados));
    assert.deepEqual(chamadas.at(-1), ["revoke", "rt2", { token_type_hint: "refresh_token" }]);
    const fim = new URL(sair.headers.get("location")!);
    assert.equal(fim.origin + fim.pathname, "https://login.test/oidc/v1/end_session");
    assert.equal(fim.searchParams.get("post_logout_redirect_uri"), "https://site.test/");
    assert.equal(fim.searchParams.get("id_token_hint"), "i".repeat(1500));
    assert.ok(fim.searchParams.get("state"));
    assert.deepEqual(sair.cookies.getAll().map((c) => [c.name, c.maxAge]), [["dadg_site_session.0", 0]]);
  } finally {
    process.env = anterior;
  }
});
