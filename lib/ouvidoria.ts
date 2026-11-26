/**
 * Regras puras da Ouvidoria (sem rede nem banco), usadas pela página, pelas rotas e pelos testes.
 * O painel (dadg-certificates) lê a mesma coleção `ouvidoria`: mudou um campo aqui, mude lá também.
 */
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export * from "./ouvidoria-opcoes";
import { ALFABETO, CATEGORIAS, EMAIL_RE, LIMITES, TIPOS, type Categoria, type Tipo } from "./ouvidoria-opcoes";

/** OUV-2026-7K3M-Q9TX: 8 símbolos aleatórios (~39 bits), impossível de adivinhar com o limite de consultas. */
export function gerarProtocolo(agora = new Date()): string {
  let s = "";
  for (let i = 0; i < 8; i++) s += ALFABETO[randomInt(ALFABETO.length)];
  return `OUV-${agora.getFullYear()}-${s.slice(0, 4)}-${s.slice(4)}`;
}

// ---------- Ficha do formulário (contra robôs) ----------

function segredo() {
  const s = process.env.OUVIDORIA_FORM_SECRET || process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET ausente");
  return s;
}

const assinar = (ts: string) => createHmac("sha256", segredo()).update(`ouvidoria:${ts}`).digest("base64url");

/** Ficha entregue ao abrir o formulário: guarda a hora, assinada pelo servidor. */
export function emitirFicha(agora = Date.now()): string {
  const ts = String(agora);
  return `${ts}.${assinar(ts)}`;
}

export type ResultadoFicha = "ok" | "invalida" | "rapida" | "vencida";

export function conferirFicha(ficha: unknown, agora = Date.now()): ResultadoFicha {
  const [ts, assinatura] = String(ficha ?? "").split(".");
  if (!ts || !assinatura || !/^\d{10,16}$/.test(ts)) return "invalida";
  const esperado = Buffer.from(assinar(ts));
  const recebido = Buffer.from(assinatura);
  if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return "invalida";
  const idade = agora - Number(ts);
  if (idade < LIMITES.tempoMinimoMs) return "rapida";
  if (idade > LIMITES.tempoMaximoMs) return "vencida";
  return "ok";
}

// ---------- Validação ----------

export type Entrada = {
  tipo: unknown;
  categoria: unknown;
  mensagem: unknown;
  anonimo: unknown;
  nome?: unknown;
  email?: unknown;
  turma?: unknown;
  consentimento: unknown;
};

export type Manifestacao = {
  tipo: Tipo;
  categoria: Categoria;
  mensagem: string;
  anonimo: boolean;
  identificacao: { nome: string; email: string; turma: string } | null;
};

const texto = (v: unknown) =>
  String(v ?? "")
    .normalize("NFC")
    // eslint-disable-next-line no-control-regex -- remove caracteres de controle, mantém quebras de linha
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();
const linha = (v: unknown) => texto(v).replace(/\s+/g, " ");
const verdadeiro = (v: unknown) => v === true || v === "true" || v === "on" || v === "1";


export function validar(e: Entrada): { ok: true; dados: Manifestacao } | { ok: false; erro: string } {
  const tipo = linha(e.tipo);
  const categoria = linha(e.categoria);
  const mensagem = texto(e.mensagem);
  const anonimo = verdadeiro(e.anonimo);

  if (!TIPOS.some((t) => t.value === tipo)) return { ok: false, erro: "Escolha o tipo da manifestação." };
  if (!CATEGORIAS.some((c) => c.value === categoria)) return { ok: false, erro: "Escolha o assunto." };
  if (mensagem.length < LIMITES.mensagemMin)
    return { ok: false, erro: `Conte um pouco mais: a descrição precisa de pelo menos ${LIMITES.mensagemMin} caracteres.` };
  if (mensagem.length > LIMITES.mensagemMax)
    return { ok: false, erro: `A descrição passou de ${LIMITES.mensagemMax} caracteres.` };
  if (!verdadeiro(e.consentimento))
    return { ok: false, erro: "Marque a autorização de tratamento dos dados para enviar." };

  if (anonimo) return { ok: true, dados: { tipo: tipo as Tipo, categoria: categoria as Categoria, mensagem, anonimo, identificacao: null } };

  const nome = linha(e.nome);
  const email = linha(e.email).toLowerCase();
  const turma = linha(e.turma);
  if (nome.length < 3) return { ok: false, erro: "Informe seu nome ou marque o envio anônimo." };
  if (nome.length > LIMITES.nomeMax) return { ok: false, erro: "Nome muito longo." };
  if (email.length > LIMITES.emailMax || !EMAIL_RE.test(email)) return { ok: false, erro: "Informe um e-mail válido." };
  if (turma.length > LIMITES.turmaMax) return { ok: false, erro: "Turma ou período muito longo." };

  return {
    ok: true,
    dados: { tipo: tipo as Tipo, categoria: categoria as Categoria, mensagem, anonimo, identificacao: { nome, email, turma } },
  };
}

// ---------- Anexo ----------

export type TipoAnexo = "image/jpeg" | "image/png" | "image/webp" | "application/pdf";

/** Tipo pelo conteúdo (assinatura do arquivo), nunca pela extensão ou pelo que o navegador declara. */
export function tipoPeloConteudo(b: Uint8Array): TipoAnexo | null {
  const comeca = (...bytes: number[]) => bytes.every((x, i) => b[i] === x);
  if (b.length >= 3 && comeca(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (b.length >= 8 && comeca(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (b.length >= 12 && comeca(0x52, 0x49, 0x46, 0x46) && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50)
    return "image/webp";
  if (b.length >= 5 && comeca(0x25, 0x50, 0x44, 0x46, 0x2d)) return "application/pdf";
  return null;
}

const EXTENSAO: Record<TipoAnexo, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Nome seguro para exibir/baixar: só letras, números, ponto, traço e sublinhado; extensão do tipo real. */
export function nomeSeguro(nome: string, tipo: TipoAnexo): string {
  const base =
    nome
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\.[^.]*$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "anexo";
  return `${base}.${EXTENSAO[tipo]}`;
}

// ---------- Limite por IP em memória (o app roda num processo só na VPS) ----------

const baldes = new Map<string, { n: number; fim: number }>();

export function dentroDoLimite(chave: string, limite: number, janelaMs: number, agora = Date.now()): boolean {
  if (baldes.size > 5000) for (const [k, v] of baldes) if (v.fim < agora) baldes.delete(k);
  const b = baldes.get(chave);
  if (!b || b.fim < agora) {
    baldes.set(chave, { n: 1, fim: agora + janelaMs });
    return true;
  }
  b.n += 1;
  return b.n <= limite;
}

/** Na VPS o Caddy sobrescreve X-Real-IP com o IP de quem conectou; X-Forwarded-For fica só de reserva. */
export function ipDoPedido(h: Headers): string {
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "local").trim();
}
