/** Opções e regras da Ouvidoria que também rodam no navegador (sem node:crypto). */

export const TIPOS = [
  { value: "reclamacao", label: "Reclamação", hint: "Algo deu errado ou não funcionou como deveria." },
  { value: "sugestao", label: "Sugestão", hint: "Uma ideia para melhorar o DADG ou o curso." },
  { value: "elogio", label: "Elogio", hint: "Reconhecer um trabalho ou uma pessoa." },
  { value: "denuncia", label: "Denúncia", hint: "Assédio, irregularidade ou conduta grave." },
  { value: "solicitacao", label: "Solicitação", hint: "Pedir uma informação, documento ou providência." },
] as const;

export const CATEGORIAS = [
  { value: "eventos", label: "Eventos" },
  { value: "certificados", label: "Certificados" },
  { value: "financeiro", label: "Financeiro" },
  { value: "estrutura", label: "Estrutura e campus" },
  { value: "curso", label: "Coordenação e professores" },
  { value: "turma", label: "Turma" },
  { value: "diretoria", label: "Diretoria do DADG" },
  { value: "outros", label: "Outros" },
] as const;

export const STATUS = [
  { value: "recebida", label: "Recebida", hint: "Sua manifestação chegou ao DADG." },
  { value: "em_analise", label: "Em análise", hint: "A diretoria está apurando e encaminhando." },
  { value: "respondida", label: "Respondida", hint: "O DADG publicou uma resposta." },
  { value: "encerrada", label: "Encerrada", hint: "O atendimento foi concluído." },
] as const;

export type Tipo = (typeof TIPOS)[number]["value"];
export type Categoria = (typeof CATEGORIAS)[number]["value"];
export type Status = (typeof STATUS)[number]["value"];

export const LIMITES = {
  mensagemMin: 20,
  mensagemMax: 4000,
  nomeMax: 100,
  emailMax: 120,
  turmaMax: 40,
  anexoBytes: 4 * 1024 * 1024,
  /** Menos que isto entre abrir o formulário e enviar é robô. */
  tempoMinimoMs: 4000,
  /** O formulário vale por 12 horas. */
  tempoMaximoMs: 12 * 60 * 60 * 1000,
} as const;

export const CONSENTIMENTO_VERSAO = "2026-11-25";

const rotulo = <T extends { value: string; label: string }>(lista: readonly T[], v: string) =>
  lista.find((x) => x.value === v)?.label ?? v;
export const rotuloTipo = (v: string) => rotulo(TIPOS, v);
export const rotuloCategoria = (v: string) => rotulo(CATEGORIAS, v);
export const rotuloStatus = (v: string) => rotulo(STATUS, v);

// ---------- Protocolo ----------

// Sem 0/O, 1/I/L e U: fácil de ditar e de digitar.
export const ALFABETO = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Aceita minúsculas, espaços e sem traços; devolve no formato oficial ou null. */
export function normalizarProtocolo(valor: unknown): string | null {
  const limpo = String(valor ?? "")
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "");
  const m = /^OUV(\d{4})([0-9A-Z]{8})$/.exec(limpo);
  if (!m || [...m[2]].some((c) => !ALFABETO.includes(c))) return null;
  return `OUV-${m[1]}-${m[2].slice(0, 4)}-${m[2].slice(4)}`;
}


export const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
