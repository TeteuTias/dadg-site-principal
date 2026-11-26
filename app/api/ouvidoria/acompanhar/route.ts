import { NextResponse } from "next/server";
import { dentroDoLimite, ipDoPedido, normalizarProtocolo } from "@/lib/ouvidoria";
import { acompanhar } from "@/lib/ouvidoria-servidor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const semCache = { "Cache-Control": "private, no-store" };

/** POST (e não GET) para o protocolo não ficar em URL, histórico nem log de acesso. */
export async function POST(req: Request) {
  if (!dentroDoLimite(`consulta:${ipDoPedido(req.headers)}`, 20, 10 * 60_000))
    return NextResponse.json({ ok: false, error: "Muitas consultas seguidas. Aguarde alguns minutos." }, { status: 429, headers: semCache });

  const body = await req.json().catch(() => ({}));
  const protocolo = normalizarProtocolo(body?.protocolo);
  if (!protocolo)
    return NextResponse.json(
      { ok: false, error: "Protocolo inválido. Ele tem o formato OUV-2026-XXXX-XXXX." },
      { status: 400, headers: semCache },
    );

  try {
    const dados = await acompanhar(protocolo);
    if (!dados)
      return NextResponse.json(
        { ok: false, error: "Não encontramos esse protocolo. Confira as letras e os números." },
        { status: 404, headers: semCache },
      );
    return NextResponse.json({ ok: true, dados }, { headers: semCache });
  } catch (e) {
    console.error("[ouvidoria] falha na consulta:", e instanceof Error ? e.name : typeof e);
    return NextResponse.json({ ok: false, error: "Consulta indisponível agora. Tente de novo em instantes." }, { status: 503, headers: semCache });
  }
}
