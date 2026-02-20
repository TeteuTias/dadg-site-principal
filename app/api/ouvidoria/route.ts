import { NextResponse } from "next/server";

const ALLOWED_TOPICS = new Set([
  "infraestrutura",
  "problemas da turma",
  "problemas com a coordenação",
  "problemas com os professores",
]);

function norm(x: unknown) {
  return String(x ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const { topic, message, website } = await req.json().catch(() => ({}));

    // Honeypot: se bot preencher, descarta silenciosamente
    if (norm(website)) return NextResponse.json({ ok: true });

    const t = norm(topic).toLowerCase();
    const m = norm(message);

    if (!ALLOWED_TOPICS.has(t)) {
      return NextResponse.json({ ok: false, error: "Tópico inválido." }, { status: 400 });
    }
    if (m.length < 20 || m.length > 2000) {
      return NextResponse.json(
        { ok: false, error: "Mensagem inválida (mín 20, máx 2000 caracteres)." },
        { status: 400 }
      );
    }

    const url = process.env.OUVIDORIA_SCRIPT_URL;
    if (!url) {
      return NextResponse.json(
        { ok: false, error: "OUVIDORIA_SCRIPT_URL não configurada." },
        { status: 500 }
      );
    }

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: t, message: m, website: "" }),
    });

    const data = await r.json().catch(() => null);
    if (!data?.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error ?? "Falha no envio." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro interno." }, { status: 500 });
  }
}