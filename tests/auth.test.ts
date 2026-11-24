import assert from "node:assert/strict";
import test from "node:test";
import { dividir, juntar, MAX_PARTE, promptPedido, retornoSeguro, sobras } from "../lib/auth/util";

test("sessão: divide em partes de até 3,8 KB e junta de volta", () => {
  const valor = "x".repeat(MAX_PARTE * 2 + 10);
  const partes = dividir("dadg_site_session", valor);
  assert.deepEqual(partes.map((p) => p.name), ["dadg_site_session.0", "dadg_site_session.1", "dadg_site_session.2"]);
  for (const p of partes) assert.ok(p.name.length + p.value.length + 120 <= 3800, "parte + atributos acima de ~3,8 KB");
  assert.equal(juntar("dadg_site_session", [{ name: "outro", value: "y" }, ...partes.reverse()]), valor);
  assert.deepEqual(dividir("s", "abc", 3), [{ name: "s.0", value: "abc" }]);
  assert.deepEqual(dividir("s", ""), []);
  assert.equal(juntar("s", []), "");
  assert.equal(juntar("s", [{ name: "s.1", value: "b" }]), "", "sem a parte 0 não há sessão");
});

test("sessão: apaga partes que sobraram e o cookie antigo do Auth0", () => {
  const existentes = ["dadg_site_session.0", "dadg_site_session.1", "dadg_site_session.2", "dadg_site_session", "dadg_site_session__0", "dadg_site_sessionx", "dadg-theme"]
    .map((name) => ({ name, value: "v" }));
  const atuais = dividir("dadg_site_session", "x".repeat(MAX_PARTE + 1));
  assert.deepEqual(sobras("dadg_site_session", existentes, atuais), ["dadg_site_session.2", "dadg_site_session", "dadg_site_session__0"]);
  assert.equal(sobras("dadg_site_session", existentes, []).length, 5, "logout apaga todas");
});

test("returnTo só aceita caminho do próprio site", () => {
  assert.equal(retornoSeguro("/perfil"), "/perfil");
  assert.equal(retornoSeguro("/processos-seletivos/1/inscricao?x=1#a"), "/processos-seletivos/1/inscricao?x=1#a");
  for (const ruim of [null, undefined, "", "perfil", "//evil.com", "/\\evil.com", "https://evil.com", "/\t/evil.com", "/a\\b", "javascript:alert(1)"])
    assert.equal(retornoSeguro(ruim), "/", String(ruim));
});

test("prompt: create, login e o antigo screen_hint=signup", () => {
  const p = (q: string) => promptPedido(new URLSearchParams(q));
  assert.equal(p("prompt=create"), "create");
  assert.equal(p("prompt=login"), "login");
  assert.equal(p("screen_hint=signup&returnTo=%2Fperfil"), "create");
  assert.equal(p("prompt=none"), undefined);
  assert.equal(p("prompt=select_account"), undefined);
  assert.equal(p(""), undefined);
});
