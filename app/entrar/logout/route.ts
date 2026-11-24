import { NextRequest, NextResponse } from "next/server";
import { ehPrefetch } from "@/lib/auth/util";
import { baseUrl, zitadel } from "@/lib/zitadel/api";
import { apagarEstado, lerEstado } from "@/lib/zitadel/cookie";
import { destinoDoLogout } from "@/lib/zitadel/destino";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (ehPrefetch(req.headers)) return new NextResponse(null, { status: 204 });
  const { sessoes } = await lerEstado();
  await Promise.allSettled(sessoes.map((s) => zitadel.encerrarSessao(s)));
  await apagarEstado();
  // Atrás do Caddy req.url é o endereço interno: a home vem do APP_BASE_URL (ou ENTRAR_BASE_URL).
  return NextResponse.redirect(destinoDoLogout(req.nextUrl.searchParams, process.env.APP_BASE_URL || baseUrl()));
}
