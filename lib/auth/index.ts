import "server-only";
import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import * as oidc from "openid-client";
import { dividir, ehPrefetch, juntar, promptPedido, retornoSeguro, sobras, type Cookie, type Usuario } from "./util";

export type { Usuario } from "./util";

/** Login pelo servidor do DADG (Zitadel, OIDC). Sessão num cookie cifrado, dividido em partes. */

type Sessao = {
  user: Usuario;
  idToken?: string;
  accessToken: string;
  expiraEm: number; // access token, em segundos epoch
  refreshToken?: string;
  fim: number; // fim da sessão (14 dias após entrar), em segundos epoch
};
type Transacao = { verifier: string; state: string; nonce: string; returnTo: string };
type Leitor = { getAll(): Cookie[] };
type Opcoes = { httpOnly?: boolean; secure?: boolean; sameSite?: "lax"; path: string; maxAge: number };
type Escrita = Cookie & { options: Opcoes };

const SESSAO = "dadg_site_session";
const TRANSACAO = "dadg_site_auth";
const VALIDADE = 14 * 24 * 60 * 60;
const CALLBACK = "/api/auth/callback";

export class SessaoExpirada extends Error {
  constructor() {
    super("Sessão expirada");
    this.name = "SessaoExpirada";
  }
}

function env(nome: string) {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável de ambiente ausente: ${nome}`);
  return valor;
}

const baseUrl = () => env("APP_BASE_URL").replace(/\/$/, "");
const seguro = () => baseUrl().startsWith("https://");
const agora = () => Math.floor(Date.now() / 1000);
const escopo = () =>
  `openid profile email offline_access urn:zitadel:iam:org:project:id:${env("OIDC_AUDIENCE")}:aud urn:zitadel:iam:org:projects:roles`;

function chave() {
  const hex = process.env.SESSION_SECRET ?? "";
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error("SESSION_SECRET precisa ter 64 caracteres hexadecimais");
  return Uint8Array.from(hex.match(/../g)!.map((b) => parseInt(b, 16)));
}

let configuracao: Promise<oidc.Configuration> | undefined;
function configOidc() {
  configuracao ??= (async () => {
    const issuer = env("OIDC_ISSUER");
    const config = await oidc.discovery(new URL(issuer), env("OIDC_CLIENT_ID"), undefined, oidc.ClientSecretBasic(env("OIDC_CLIENT_SECRET")));
    // O iss do id_token é comparado com o da descoberta: exigir que seja exatamente o configurado.
    if (config.serverMetadata().issuer !== issuer) throw new Error("OIDC_ISSUER não é igual ao issuer da descoberta");
    return config;
  })().catch((e) => {
    configuracao = undefined; // tenta de novo na próxima requisição
    throw e;
  });
  return configuracao;
}

async function cifrar(dados: object, expiraEm: number) {
  return new EncryptJWT(dados as JWTPayload).setProtectedHeader({ alg: "dir", enc: "A256GCM" }).setIssuedAt().setExpirationTime(expiraEm).encrypt(chave());
}

async function decifrar<T>(valor: string | undefined): Promise<T | null> {
  if (!valor) return null;
  try {
    return (await jwtDecrypt(valor, chave())).payload as T;
  } catch {
    return null; // vencido, adulterado ou de outra chave
  }
}

async function lerSessao(leitor: Leitor): Promise<Sessao | null> {
  const s = await decifrar<Sessao>(juntar(SESSAO, leitor.getAll()));
  return s?.user?.sub && s.accessToken ? s : null;
}

/** Cookies a gravar (partes novas) e a apagar (sobras); `sessao` null apaga tudo. */
async function escritasDaSessao(sessao: Sessao | null, leitor: Leitor): Promise<Escrita[]> {
  const partes = sessao ? dividir(SESSAO, await cifrar(sessao, sessao.fim)) : [];
  const maxAge = sessao ? sessao.fim - agora() : 0;
  return [
    ...partes.map((p) => ({ ...p, options: { httpOnly: true, secure: seguro(), sameSite: "lax" as const, path: "/", maxAge } })),
    ...sobras(SESSAO, leitor.getAll(), partes).map((name) => ({ name, value: "", options: { path: "/", maxAge: 0 } })),
  ];
}

function usuario(c: Record<string, unknown>): Usuario {
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  return {
    sub: String(c.sub),
    email: str(c.email),
    email_verified: c.email_verified === true || c.email_verified === "true",
    name: str(c.name),
    picture: str(c.picture),
  };
}

// Pedidos simultâneos com o mesmo refresh token reaproveitam a mesma renovação (o servidor pode girar o token).
const renovacoes = new Map<string, Promise<Sessao>>();
function renovar(s: Sessao): Promise<Sessao> {
  const token = s.refreshToken;
  if (!token) return Promise.reject(new SessaoExpirada());
  let pedido = renovacoes.get(token);
  if (!pedido) {
    pedido = (async () => {
      const t = await oidc.refreshTokenGrant(await configOidc(), token);
      return { ...s, accessToken: t.access_token, expiraEm: agora() + (t.expiresIn() ?? 0), refreshToken: t.refresh_token ?? token, idToken: t.id_token ?? s.idToken };
    })();
    pedido
      .catch((e) => console.error("[auth] renovação falhou:", e instanceof Error ? e.name : typeof e))
      .finally(() => setTimeout(() => renovacoes.delete(token), 30_000).unref());
    renovacoes.set(token, pedido);
  }
  return pedido.catch(() => {
    throw new SessaoExpirada();
  });
}

// ---------- API usada pelo site ----------

export async function getSession(req?: NextRequest): Promise<{ user: Usuario } | null> {
  const s = await lerSessao(req ? req.cookies : await cookies());
  return s ? { user: s.user } : null;
}

/** Access token para o certificados; renova se faltar menos de 60 s. Falhou: SessaoExpirada. */
export async function getAccessToken(): Promise<{ token: string }> {
  const loja = await cookies();
  const s = await lerSessao(loja);
  if (!s) throw new SessaoExpirada();
  if (s.expiraEm - agora() > 60) return { token: s.accessToken };
  const nova = await renovar(s);
  try {
    for (const e of await escritasDaSessao(nova, loja)) loja.set(e.name, e.value, e.options);
  } catch {
    // Server Component não grava cookie; o proxy regrava antes do vencimento.
  }
  return { token: nova.accessToken };
}

/**
 * Chamado pelo proxy em toda página: renova o access token 5 min antes de vencer e grava o cookie
 * (Server Components não conseguem gravar). A requisição atual já segue com a sessão nova.
 */
export async function manterSessao(req: NextRequest): Promise<NextResponse> {
  if (req.nextUrl.pathname.startsWith("/api/auth/")) return NextResponse.next();
  const s = await lerSessao(req.cookies).catch(() => null);
  if (!s?.refreshToken || s.expiraEm - agora() > 300) return NextResponse.next();
  let escritas: Escrita[];
  try {
    escritas = await escritasDaSessao(await renovar(s), req.cookies);
  } catch {
    return NextResponse.next(); // getAccessToken trata a sessão como expirada
  }
  for (const e of escritas) {
    if (e.value) req.cookies.set(e.name, e.value);
    else req.cookies.delete(e.name);
  }
  const res = NextResponse.next({ request: { headers: req.headers } });
  for (const e of escritas) res.cookies.set(e.name, e.value, e.options);
  return res;
}

// ---------- Rotas /api/auth/* ----------

function erroLogin() {
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Entrar</title><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1rem;line-height:1.5"><h1 style="font-size:1.25rem">Não foi possível concluir a entrada</h1><p>O pedido de login expirou ou não é válido.</p><p><a href="/api/auth/login">Tentar de novo</a> · <a href="/">Voltar ao site</a></p></body></html>`;
  return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function iniciarLogin(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const config = await configOidc();
  const verifier = oidc.randomPKCECodeVerifier();
  const tx: Transacao = { verifier, state: oidc.randomState(), nonce: oidc.randomNonce(), returnTo: retornoSeguro(q.get("returnTo")) };
  const prompt = promptPedido(q);
  const url = oidc.buildAuthorizationUrl(config, {
    redirect_uri: `${baseUrl()}${CALLBACK}`,
    scope: escopo(),
    code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
    code_challenge_method: "S256",
    state: tx.state,
    nonce: tx.nonce,
    ...(prompt ? { prompt } : {}),
  });
  const res = NextResponse.redirect(url);
  res.cookies.set(TRANSACAO, await cifrar(tx, agora() + 600), { httpOnly: true, secure: seguro(), sameSite: "lax", path: "/api/auth", maxAge: 600 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function concluirLogin(req: NextRequest) {
  const tx = await decifrar<Transacao>(req.cookies.get(TRANSACAO)?.value);
  if (!tx) return erroLogin();
  try {
    const config = await configOidc();
    // A URL pública (atrás do proxy reverso req.url é interna); redirect_uri sai dela.
    const atual = new URL(`${baseUrl()}${CALLBACK}${req.nextUrl.search}`);
    const tokens = await oidc.authorizationCodeGrant(config, atual, {
      pkceCodeVerifier: tx.verifier,
      expectedState: tx.state,
      expectedNonce: tx.nonce,
      idTokenExpected: true,
    });
    const claims = tokens.claims()!;
    let info: Record<string, unknown> = {};
    try {
      info = await oidc.fetchUserInfo(config, tokens.access_token, claims.sub);
    } catch {
      /* sem userinfo, fica com o que veio no id_token */
    }
    const sessao: Sessao = {
      user: usuario({ ...claims, ...info, sub: claims.sub }),
      idToken: tokens.id_token,
      accessToken: tokens.access_token,
      expiraEm: agora() + (tokens.expiresIn() ?? 0),
      refreshToken: tokens.refresh_token,
      fim: agora() + VALIDADE,
    };
    const res = NextResponse.redirect(new URL(retornoSeguro(tx.returnTo), baseUrl()));
    for (const e of await escritasDaSessao(sessao, req.cookies)) res.cookies.set(e.name, e.value, e.options);
    res.cookies.set(TRANSACAO, "", { path: "/api/auth", maxAge: 0 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    const codigo = e && typeof e === "object" && "code" in e ? String((e as { code: unknown }).code) : "";
    console.error("[auth] callback falhou:", e instanceof Error ? e.name : typeof e, codigo);
    return erroLogin();
  }
}

export async function sair(req: NextRequest) {
  if (ehPrefetch(req.headers)) return new NextResponse(null, { status: 204 });
  const s = await lerSessao(req.cookies);
  let destino = new URL(`${baseUrl()}/`);
  try {
    const config = await configOidc();
    if (s?.refreshToken) {
      // Sem revogar, o refresh token continua válido depois de sair.
      await oidc.tokenRevocation(config, s.refreshToken, { token_type_hint: "refresh_token" }).catch((e) =>
        console.error("[auth] revogação falhou:", e instanceof Error ? e.name : typeof e),
      );
    }
    destino = oidc.buildEndSessionUrl(config, {
      ...(s?.idToken ? { id_token_hint: s.idToken } : {}),
      // Única volta aceita pelo servidor de login; a /entrar/logout encerra as sessões da tela de login e lê o state.
      post_logout_redirect_uri: `${baseUrl()}/entrar/logout`,
      state: "site",
    });
  } catch (e) {
    console.error("[auth] logout sem servidor de login:", e instanceof Error ? e.name : typeof e);
  }
  const res = NextResponse.redirect(destino);
  for (const e of await escritasDaSessao(null, req.cookies)) res.cookies.set(e.name, e.value, e.options);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
