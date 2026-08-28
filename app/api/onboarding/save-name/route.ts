import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import { connectToDatabase } from "@/app/lib/mongodb";
import { ProfileModel } from "@/app/lib/models/ProfileModel";

export const dynamic = "force-dynamic";

function getUserIdFromSession(sub: string | undefined | null) {
  if (!sub || typeof sub !== "string") return null;
  return sub;
}

export async function POST(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
  }

  const userId = getUserIdFromSession(session.user.sub);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Sessão inválida" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ ok: false, error: "Nome é obrigatório" }, { status: 400 });
  }

  await connectToDatabase();

  const now = new Date();
  const update = {
    name,
    updatedAt: now,
    $setOnInsert: { createdAt: now },
  };

  await ProfileModel.updateOne({ _id: userId }, update, { upsert: true });

  return NextResponse.json({ ok: true });
}
