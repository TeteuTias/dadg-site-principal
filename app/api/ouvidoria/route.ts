// app/api/ouvidoria/route.ts
import { NextResponse } from "next/server";

// ===== Config =====
const SCRIPT_URL = process.env.OUVIDORIA_SCRIPT_URL;

const MIN_MESSAGE = 20;
const MAX_MESSAGE = 2000;
const MAX_NAME = 80;

const MIN_TURMA = 1;
const MAX_TURMA = 99;

const ALLOWED_TOPICS = new Set([
  "infraestrutura",
  "problemas da turma",
  "problemas com a coordenação",
  "problemas com os professores",
]);

// ===== Anti-spam: rate limit em memória (5 req/min por IP) =====
// Obs.: em serverless com várias instâncias pode não ser perfeito, mas já ajuda bastante.
const bucket = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = bucket.get(key);

  if (!entry || now > entry.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) return { ok: false };

  entry.count += 1;
  return { ok: true };
}

function norm(x: unknown) {
  return String(x ?? "").trim();
}

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

export async function POST(req: Request) {
  try {
    if (!SCRIPT_URL) {
      return NextResponse.json(
        { ok: false, error: "OUVIDORIA_SCRIPT_URL não configurada." },
        { status: 500 }
      );
    }

    // Rate limit
    const ip = getClientIp(req);
    const rl = rateLimit(ip, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Muitas tentativas. Aguarde 1 minuto e tente novamente." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const website = norm(body.website);

    // Honeypot: se bot preencher, finge sucesso e descarta
    if (website) return NextResponse.json({ ok: true });

    const topic = norm(body.topic).toLowerCase();
    const classNumberRaw = norm(body.classNumber);
    const name = norm(body.name); // opcional
    const message = norm(body.message);

    // Validações
    if (!ALLOWED_TOPICS.has(topic)) {
      return NextResponse.json({ ok: false, error: "Tópico inválido." }, { status: 400 });
    }

    // Turma (obrigatória)
    const classNumber = parseInt(classNumberRaw, 10);
    if (!Number.isFinite(classNumber) || classNumber < MIN_TURMA || classNumber > MAX_TURMA) {
      return NextResponse.json(
        { ok: false, error: `Turma inválida (use um número entre ${MIN_TURMA} e ${MAX_TURMA}).` },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME) {
      return NextResponse.json(
        { ok: false, error: `Nome muito longo (máx ${MAX_NAME} caracteres).` },
        { status: 400 }
      );
    }

    if (message.length < MIN_MESSAGE || message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { ok: false, error: `Mensagem inválida (mín ${MIN_MESSAGE}, máx ${MAX_MESSAGE} caracteres).` },
        { status: 400 }
      );
    }

    // Envia pro Apps Script
    const r = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // website vazio aqui (o honeypot é só do front)
      body: JSON.stringify({ topic, classNumber, name, message, website: "" }),
    });

    // Apps Script às vezes responde HTML em erro; por isso lemos como texto e tentamos parsear.
    const text = await r.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (!r.ok || !data?.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: data?.error ?? `Falha ao enviar (status do script: ${r.status}).`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro interno." }, { status: 500 });
  }
}