import { NextRequest, NextResponse } from "next/server";
import { zitadel } from "@/lib/zitadel/api";
import { apagarEstado, lerEstado } from "@/lib/zitadel/cookie";
import { destinoPermitido } from "@/lib/zitadel/destino";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { sessoes } = await lerEstado();
  await Promise.allSettled(sessoes.map((s) => zitadel.encerrarSessao(s)));
  await apagarEstado();
  const destino = destinoPermitido(req.nextUrl.searchParams.get("post_logout_redirect"));
  return NextResponse.redirect(destino ?? new URL("/", req.nextUrl.origin));
}
