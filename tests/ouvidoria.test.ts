import assert from "node:assert/strict";
import test from "node:test";

import * as o from "../lib/ouvidoria";

process.env.SESSION_SECRET ??= "a".repeat(64);

test("protocolo: formato, normalização e recusa de símbolos ambíguos", () => {
  const p = o.gerarProtocolo(new Date("2026-11-25T12:00:00Z"));
  assert.match(p, /^OUV-2026-[2-9A-HJKMNP-TV-Z]{4}-[2-9A-HJKMNP-TV-Z]{4}$/);
  assert.equal(o.normalizarProtocolo(p.toLowerCase().replace(/-/g, " ")), p);
  assert.equal(o.normalizarProtocolo("OUV-2026-0000-1111"), null);
  assert.equal(o.normalizarProtocolo("qualquer coisa"), null);
  assert.equal(new Set(Array.from({ length: 200 }, () => o.gerarProtocolo())).size, 200);
});

test("ficha do formulário: assinatura, tempo mínimo e validade", () => {
  const agora = Date.now();
  const ficha = o.emitirFicha(agora);
  assert.equal(o.conferirFicha(ficha, agora + 1000), "rapida");
  assert.equal(o.conferirFicha(ficha, agora + 10_000), "ok");
  assert.equal(o.conferirFicha(ficha, agora + 13 * 3600_000), "vencida");
  assert.equal(o.conferirFicha(`${agora - 10_000}.falsa`, agora), "invalida");
  assert.equal(o.conferirFicha(undefined, agora), "invalida");
});

const base = { tipo: "reclamacao", categoria: "eventos", mensagem: "Faltou água no evento de sábado no bloco B.", consentimento: "true" };

test("validação: anônimo não guarda identificação", () => {
  const v = o.validar({ ...base, anonimo: "true", nome: "Fulano", email: "f@x.com" });
  assert.equal(v.ok, true);
  if (v.ok) assert.equal(v.dados.identificacao, null);
});

test("validação: identificado exige nome e e-mail válidos", () => {
  assert.equal(o.validar({ ...base, anonimo: "false", nome: "Ana", email: "ruim" }).ok, false);
  assert.equal(o.validar({ ...base, anonimo: "false", nome: "Ana", email: "x@a.co?cc=b@c.com" }).ok, false);
  const v = o.validar({ ...base, anonimo: "false", nome: "  Ana  Souza ", email: "ANA@Gmail.com", turma: "39" });
  assert.equal(v.ok, true);
  if (v.ok) assert.deepEqual(v.dados.identificacao, { nome: "Ana Souza", email: "ana@gmail.com", turma: "39" });
});

test("validação: tipo, assunto, tamanho e consentimento", () => {
  assert.equal(o.validar({ ...base, anonimo: true, tipo: "spam" }).ok, false);
  assert.equal(o.validar({ ...base, anonimo: true, categoria: "x" }).ok, false);
  assert.equal(o.validar({ ...base, anonimo: true, mensagem: "curta" }).ok, false);
  assert.equal(o.validar({ ...base, anonimo: true, mensagem: "a".repeat(4001) }).ok, false);
  assert.equal(o.validar({ ...base, anonimo: true, consentimento: undefined }).ok, false);
});

test("anexo: tipo pelo conteúdo e nome seguro", () => {
  assert.equal(o.tipoPeloConteudo(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), "image/jpeg");
  assert.equal(o.tipoPeloConteudo(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), "image/png");
  assert.equal(o.tipoPeloConteudo(new TextEncoder().encode("%PDF-1.7")), "application/pdf");
  assert.equal(o.tipoPeloConteudo(new TextEncoder().encode("<svg onload=alert(1)>")), null);
  assert.equal(o.tipoPeloConteudo(new TextEncoder().encode("MZ executável")), null);
  assert.equal(o.nomeSeguro("../../Foto do Évento <x>.php.jpg", "image/png"), "Foto-do-Evento-x-php.png");
});

test("IP: usa o X-Real-IP que o Caddy grava, não o X-Forwarded-For do cliente", () => {
  assert.equal(o.ipDoPedido(new Headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "9.9.9.9" })), "1.1.1.1");
});

test("limite por IP", () => {
  const t = 1_000;
  for (let i = 0; i < 3; i++) assert.equal(o.dentroDoLimite("teste", 3, 60_000, t), true);
  assert.equal(o.dentroDoLimite("teste", 3, 60_000, t), false);
  assert.equal(o.dentroDoLimite("teste", 3, 60_000, t + 61_000), true);
});
