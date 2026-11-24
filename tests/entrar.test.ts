import assert from "node:assert/strict";
import test from "node:test";
import { destinoDoLogout, destinoPermitido } from "../lib/zitadel/destino";
import { ehPrefetch } from "../lib/auth/util";
import { checarSenha, senhaOk, REGRAS_PADRAO } from "../lib/zitadel/senha";
import { criarLimitador, LIMITES } from "../lib/zitadel/limite";
import { loadIsolated } from "./helpers/isolated";

test("logout só redireciona para os sites do DADG/CIEPS", () => {
  assert.equal(destinoPermitido("https://www.dadg.com.br/perfil", true), "https://www.dadg.com.br/perfil");
  assert.equal(destinoPermitido("https://www.admin.congressocieps.com.br/", true), "https://www.admin.congressocieps.com.br/");
  assert.equal(destinoPermitido("http://www.dadg.com.br/", true), null);
  assert.equal(destinoPermitido("https://www.dadg.com.br.evil.com/", true), null);
  assert.equal(destinoPermitido("https://evil.com/?x=www.dadg.com.br", true), null);
  assert.equal(destinoPermitido("//www.dadg.com.br", true), null);
  assert.equal(destinoPermitido("javascript:alert(1)", true), null);
  assert.equal(destinoPermitido("http://localhost:3001/", true), null);
  assert.equal(destinoPermitido("http://localhost:3001/", false), "http://localhost:3001/");
  assert.equal(destinoPermitido(null, false), null);
});

test("regras de senha", () => {
  assert.equal(senhaOk("Abcdef1!", REGRAS_PADRAO), true);
  assert.equal(senhaOk("abcdef1!", REGRAS_PADRAO), false);
  assert.equal(senhaOk("Abc1!", REGRAS_PADRAO), false);
  const semSimbolo = { ...REGRAS_PADRAO, simbolo: false };
  assert.equal(senhaOk("Abcdefg1", semSimbolo), true);
  assert.equal(checarSenha("", semSimbolo).length, 4);
});

test("limitador: bloqueia ao estourar e libera quando a janela vence", () => {
  let t = 0;
  const l = criarLimitador(() => t);
  const r = [{ chave: "a", max: 2, janelaMs: 1000 }];
  assert.equal(l.consumir(r), true);
  assert.equal(l.consumir(r), true);
  assert.equal(l.consumir(r), false);
  t = 1000;
  assert.equal(l.consumir(r), true);
});

test("limitador: regra estourada não gasta a cota das outras", () => {
  const l = criarLimitador(() => 0);
  const ip = { chave: "ip", max: 1, janelaMs: 1000 };
  assert.equal(l.consumir([ip, { chave: "email:a", max: 3, janelaMs: 1000 }]), true);
  assert.equal(l.consumir([ip, { chave: "email:b", max: 3, janelaMs: 1000 }]), false);
  assert.equal(l.consumir([{ chave: "email:b", max: 1, janelaMs: 1000 }]), true);
});

test("limitador: entradas vencidas são removidas", () => {
  let t = 0;
  const l = criarLimitador(() => t);
  for (let i = 0; i < 50; i++) l.consumir([{ chave: `k${i}`, max: 1, janelaMs: 1000 }]);
  assert.equal(l.tamanho(), 50);
  t = 120_000;
  l.consumir([{ chave: "novo", max: 1, janelaMs: 1000 }]);
  assert.equal(l.tamanho(), 1);
});

test("limites configurados: esqueci a senha 3 por e-mail", () => {
  const l = criarLimitador(() => 0);
  for (let i = 0; i < 3; i++) assert.equal(l.consumir(LIMITES.esqueci("1.1.1.1", "A@x.com")), true);
  assert.equal(l.consumir(LIMITES.esqueci("2.2.2.2", "a@x.com")), false);
});

// fluxo.ts é server-only: carrega isolado, só com as funções puras.
const fluxo = loadIsolated("lib/zitadel/fluxo.ts", {
  "server-only": {},
  "./api": { zitadel: {}, ZitadelError: class {} },
  "./senha": { REGRAS_PADRAO: {} },
}) as unknown as { userIdValido: (v: unknown) => boolean; normalizarEmail: (v: string) => string };

test("userIdValido aceita IDs auth0|hex e recusa o resto", () => {
  assert.equal(fluxo.userIdValido("auth0|6a0000000000000000000001"), true);
  assert.equal(fluxo.userIdValido("340123456789012345"), true);
  assert.equal(fluxo.userIdValido(""), false);
  assert.equal(fluxo.userIdValido("a b"), false);
  assert.equal(fluxo.userIdValido("../x"), false);
  assert.equal(fluxo.userIdValido(`auth0|${"a".repeat(64)}`), false);
  assert.equal(fluxo.userIdValido(undefined), false);
});

test("normalizarEmail tira espaços e maiúsculas", () => {
  assert.equal(fluxo.normalizarEmail("  Fulano@Gmail.COM "), "fulano@gmail.com");
});

test("logout: state do servidor de login vira destino fixo, nunca localhost em produção", () => {
  const ir = (q: string, producao = true) => destinoDoLogout(new URLSearchParams(q), "https://www.dadg.com.br", producao);
  assert.equal(ir("state=site"), "https://www.dadg.com.br/");
  assert.equal(ir("state=certificados"), "https://certificados.dadg.com.br/");
  assert.equal(ir("state=https://evil.com"), "https://www.dadg.com.br/");
  assert.equal(ir("state=__proto__"), "https://www.dadg.com.br/");
  assert.equal(ir(""), "https://www.dadg.com.br/");
  assert.equal(ir("post_logout_redirect=https%3A%2F%2Fwww.admin.congressocieps.com.br%2F&state=site"), "https://www.admin.congressocieps.com.br/");
  assert.equal(ir("post_logout_redirect=https%3A%2F%2Fevil.com%2F"), "https://www.dadg.com.br/");
  assert.equal(ir("post_logout_redirect=http%3A%2F%2Flocalhost%3A3100%2F"), "https://www.dadg.com.br/");
  assert.equal(destinoDoLogout(new URLSearchParams(""), "https://www.dadg.com.br/", true), "https://www.dadg.com.br/");
  assert.equal(ir("post_logout_redirect=http%3A%2F%2Flocalhost%3A3001%2F", false), "http://localhost:3001/");
});

test("pré-carregamento não pode deslogar", () => {
  assert.equal(ehPrefetch(new Headers({ "next-router-prefetch": "1" })), true);
  assert.equal(ehPrefetch(new Headers({ purpose: "prefetch" })), true);
  assert.equal(ehPrefetch(new Headers({ "sec-purpose": "prefetch;prerender" })), true);
  assert.equal(ehPrefetch(new Headers({ accept: "text/html" })), false);
});
