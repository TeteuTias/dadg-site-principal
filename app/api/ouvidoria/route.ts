import { NextResponse } from "next/server";
import {
  conferirFicha,
  dentroDoLimite,
  emitirFicha,
  ipDoPedido,
  LIMITES,
  nomeSeguro,
  tipoPeloConteudo,
  validar,
} from "@/lib/ouvidoria";
import { avisarNovaManifestacao, registrar, semMetadados, type Anexo } from "@/lib/ouvidoria-servidor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const semCache = { "Cache-Control": "private, no-store" };
const erro = (mensagem: string, status = 400) => NextResponse.json({ ok: false, error: mensagem }, { status, headers: semCache });

/** Ficha do formulário: o envio só vale alguns segundos depois de abrir a página. */
export async function GET() {
  return NextResponse.json({ ficha: emitirFicha() }, { headers: semCache });
}

export async function POST(req: Request) {
  const ip = ipDoPedido(req.headers);
  // Além do limite geral do proxy: 20 tentativas e 5 manifestações gravadas a cada 15 min por IP.
  if (!dentroDoLimite(`tentativa:${ip}`, 20, 15 * 60_000))
    return erro("Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.", 429);

  // Sem Content-Length (envio em partes) não dá para limitar antes de ler: o navegador sempre manda.
  const tamanho = Number(req.headers.get("content-length"));
  if (!Number.isFinite(tamanho) || tamanho <= 0) return erro("Envio inválido. Recarregue a página e tente de novo.", 411);
  if (tamanho > LIMITES.anexoBytes + 64 * 1024) return erro("O anexo passou de 4 MB.", 413);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return erro("Não foi possível ler o formulário. Recarregue a página e tente de novo.");
  }

  // Campo invisível: só robô preenche. Responde como se desse certo, sem gravar.
  if (String(form.get("site") ?? "").trim()) return NextResponse.json({ ok: true, protocolo: null }, { headers: semCache });

  const ficha = conferirFicha(form.get("ficha"));
  if (ficha === "rapida") return erro("Envio rápido demais. Confira os dados e envie de novo.");
  if (ficha === "vencida") return erro("O formulário ficou aberto por muito tempo. Recarregue a página e envie de novo.");
  if (ficha !== "ok") return erro("Formulário inválido. Recarregue a página e tente de novo.");

  const v = validar({
    tipo: form.get("tipo"),
    categoria: form.get("categoria"),
    mensagem: form.get("mensagem"),
    anonimo: form.get("anonimo"),
    nome: form.get("nome"),
    email: form.get("email"),
    turma: form.get("turma"),
    consentimento: form.get("consentimento"),
  });
  if (!v.ok) return erro(v.erro);

  let anexo: Anexo | null = null;
  const arquivo = form.get("anexo");
  if (arquivo && typeof arquivo !== "string" && arquivo.size > 0) {
    if (arquivo.size > LIMITES.anexoBytes) return erro("O anexo passou de 4 MB.", 413);
    const dados = new Uint8Array(await arquivo.arrayBuffer());
    const tipo = tipoPeloConteudo(dados);
    if (!tipo) return erro("Anexo não aceito. Envie uma imagem (JPG, PNG ou WEBP) ou um PDF.");
    // Imagens são regravadas sem metadados (EXIF com GPS, aparelho, autor). Anônimo: nome do arquivo também sai.
    const limpos = tipo === "application/pdf" ? dados : await semMetadados(dados, tipo);
    if (!limpos) return erro("Não conseguimos ler essa imagem. Tente outra foto ou envie em PDF.");
    anexo = { nome: nomeSeguro(v.dados.anonimo ? "anexo" : arquivo.name || "anexo", tipo), tipo, dados: limpos };
  }

  if (!dentroDoLimite(`envio:${ip}`, 5, 15 * 60_000))
    return erro("Você enviou várias manifestações seguidas. Aguarde alguns minutos e tente de novo.", 429);

  try {
    const protocolo = await registrar(v.dados, anexo);
    avisarNovaManifestacao(protocolo, v.dados);
    return NextResponse.json({ ok: true, protocolo }, { status: 201, headers: semCache });
  } catch (e) {
    console.error("[ouvidoria] falha ao registrar:", e instanceof Error ? e.name : typeof e);
    return erro("Não conseguimos registrar agora. Tente de novo em alguns minutos.", 503);
  }
}
