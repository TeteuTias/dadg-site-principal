import "server-only";
import { Binary, ObjectId, type Db } from "mongodb";
import { connectToDatabase } from "@/app/lib/mongodb";
import {
  CONSENTIMENTO_VERSAO,
  gerarProtocolo,
  rotuloCategoria,
  rotuloTipo,
  type Manifestacao,
  type Status,
  type TipoAnexo,
} from "./ouvidoria";

/** Coleções novas, só desta funcionalidade. O painel (dadg-certificates) lê e responde nelas. */
export const COLECAO = "ouvidoria";
export const COLECAO_ANEXOS = "ouvidoria_anexos";

export type Anexo = { nome: string; tipo: TipoAnexo; dados: Uint8Array };

type Historico = { status: Status; em: Date };

export type Documento = Manifestacao & {
  _id: ObjectId;
  protocolo: string;
  status: Status;
  anexo: { id: ObjectId; nome: string; tipo: TipoAnexo; tamanho: number } | null;
  resposta: { texto: string; em: Date } | null;
  historico: Historico[];
  consentimento: { em: Date; versao: string };
  criadaEm: Date;
  atualizadaEm: Date;
};

async function banco(): Promise<Db> {
  const conexao = await connectToDatabase();
  const db = conexao.connection.db;
  if (!db) throw new Error("Banco indisponível");
  return db as unknown as Db;
}

/** Regrava a imagem sem metadados (EXIF/XMP/ICC), já na orientação certa. null = não é imagem válida. */
export async function semMetadados(dados: Uint8Array, tipo: TipoAnexo): Promise<Uint8Array | null> {
  try {
    const sharp = (await import("sharp")).default;
    const img = sharp(dados, { limitInputPixels: 50_000_000 }).rotate();
    const saida = tipo === "image/png" ? img.png() : tipo === "image/webp" ? img.webp({ quality: 88 }) : img.jpeg({ quality: 88 });
    return new Uint8Array(await saida.toBuffer());
  } catch {
    return null;
  }
}

export async function registrar(m: Manifestacao, anexo: Anexo | null): Promise<string> {
  const db = await banco();
  const col = db.collection<Documento>(COLECAO);
  const agora = new Date();
  const _id = new ObjectId();

  // Protocolo aleatório; a chance de repetir é desprezível, mas confere mesmo assim.
  let protocolo = gerarProtocolo(agora);
  for (let i = 0; i < 5 && (await col.findOne({ protocolo }, { projection: { _id: 1 } })); i++) protocolo = gerarProtocolo(agora);

  let infoAnexo: Documento["anexo"] = null;
  let anexoId: ObjectId | null = null;
  if (anexo) {
    anexoId = new ObjectId();
    await db.collection(COLECAO_ANEXOS).insertOne({
      _id: anexoId,
      manifestacaoId: _id,
      protocolo,
      nome: anexo.nome,
      tipo: anexo.tipo,
      tamanho: anexo.dados.byteLength,
      dados: new Binary(anexo.dados),
      criadoEm: agora,
    });
    infoAnexo = { id: anexoId, nome: anexo.nome, tipo: anexo.tipo, tamanho: anexo.dados.byteLength };
  }

  try {
    await col.insertOne({
    ...m,
    _id,
    protocolo,
    status: "recebida",
    anexo: infoAnexo,
    resposta: null,
    historico: [{ status: "recebida", em: agora }],
    consentimento: { em: agora, versao: CONSENTIMENTO_VERSAO },
    criadaEm: agora,
    atualizadaEm: agora,
    });
  } catch (e) {
    // Sem a manifestação, o anexo não serve para nada: não deixa 4 MB órfãos no banco.
    if (anexoId) await db.collection(COLECAO_ANEXOS).deleteOne({ _id: anexoId }).catch(() => undefined);
    throw e;
  }
  return protocolo;
}

/** O que o aluno vê pelo protocolo: andamento e resposta pública. Nunca a descrição nem a identificação. */
export type Acompanhamento = {
  protocolo: string;
  tipo: string;
  categoria: string;
  status: Status;
  criadaEm: string;
  atualizadaEm: string;
  historico: { status: Status; em: string }[];
  resposta: { texto: string; em: string } | null;
};

export async function acompanhar(protocolo: string): Promise<Acompanhamento | null> {
  const db = await banco();
  const d = await db
    .collection<Documento>(COLECAO)
    .findOne({ protocolo }, { projection: { protocolo: 1, tipo: 1, categoria: 1, status: 1, criadaEm: 1, atualizadaEm: 1, historico: 1, resposta: 1 } });
  if (!d) return null;
  return {
    protocolo: d.protocolo,
    tipo: rotuloTipo(d.tipo),
    categoria: rotuloCategoria(d.categoria),
    status: d.status,
    criadaEm: d.criadaEm.toISOString(),
    atualizadaEm: d.atualizadaEm.toISOString(),
    historico: (d.historico ?? []).map((h) => ({ status: h.status, em: new Date(h.em).toISOString() })),
    resposta: d.resposta?.texto ? { texto: d.resposta.texto, em: new Date(d.resposta.em).toISOString() } : null,
  };
}

// ---------- Aviso de manifestação nova ----------

const PAINEL = () => `${(process.env.OUVIDORIA_PAINEL_URL || "https://certificados.dadg.com.br").replace(/\/$/, "")}/ouvidoria`;

async function comPrazo(url: string, init: RequestInit, ms = 8000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: c.signal });
  } finally {
    clearTimeout(t);
  }
}

/**
 * E-mail para a diretoria pelo Brevo (só se BREVO_API_KEY existir no servidor).
 * Vai só o aviso (protocolo, tipo, assunto) e o link do painel: o conteúdo e a identificação ficam no painel.
 */
async function avisarPorEmail(protocolo: string, m: Manifestacao): Promise<"enviado" | "sem-chave" | "falhou"> {
  const chave = process.env.BREVO_API_KEY;
  if (!chave) return "sem-chave";
  const para = (process.env.OUVIDORIA_AVISO_PARA || "contato@dadg.com.br").split(",").map((e) => ({ email: e.trim() })).filter((e) => e.email);
  const de = process.env.OUVIDORIA_AVISO_DE || "nao-responda@dadg.com.br";
  const tipo = rotuloTipo(m.tipo);
  const assunto = rotuloCategoria(m.categoria);
  const linhas = [
    `Chegou uma nova manifestação na Ouvidoria do DADG.`,
    ``,
    `Protocolo: ${protocolo}`,
    `Tipo: ${tipo}`,
    `Assunto: ${assunto}`,
    `Identificação: ${m.anonimo ? "anônima" : "identificada"}`,
    ``,
    `Leia e responda no painel: ${PAINEL()}`,
    `(o texto e os dados de quem enviou ficam só no painel, que exige login de administrador)`,
  ];
  try {
    const r = await comPrazo("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": chave, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Ouvidoria DADG", email: de },
        to: para,
        subject: `[Ouvidoria] ${tipo} · ${assunto} · ${protocolo}`,
        textContent: linhas.join("\n"),
      }),
    });
    return r.ok ? "enviado" : "falhou";
  } catch {
    return "falhou";
  }
}

/**
 * Canal antigo (Google Apps Script em OUVIDORIA_SCRIPT_URL), mantido enquanto o DADG depender dele.
 * Vai só o aviso com o protocolo, sem descrição nem identificação: os dados ficam no banco do DADG.
 */
async function avisarCanalAntigo(protocolo: string, m: Manifestacao): Promise<boolean> {
  const url = process.env.OUVIDORIA_SCRIPT_URL;
  if (!url) return true;
  try {
    const r = await comPrazo(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        protocolo,
        topic: rotuloCategoria(m.categoria).toLowerCase(),
        classNumber: "",
        name: "",
        phone: "",
        message: `Nova manifestação na ouvidoria: ${protocolo} (${rotuloTipo(m.tipo)}, ${rotuloCategoria(m.categoria)}). Leia e responda em ${PAINEL()}`,
        website: "",
      }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

/** Não segura a resposta ao aluno: o registro no banco já foi feito. */
export function avisarNovaManifestacao(protocolo: string, m: Manifestacao) {
  void avisarPorEmail(protocolo, m)
    .then((r) => {
      if (r === "falhou") console.error("[ouvidoria] aviso por e-mail falhou", protocolo);
    })
    .catch(() => undefined);
  void avisarCanalAntigo(protocolo, m)
    .then((ok) => {
      if (!ok) console.error("[ouvidoria] aviso pelo canal antigo falhou", protocolo);
    })
    .catch(() => undefined);
}
