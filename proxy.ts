import { NextRequest, NextResponse } from "next/server";
import { getSession, manterSessao } from "./lib/auth";
import { rateLimit } from "./lib/RateLimit";

const RATE_LIMIT = Number(process.env.RATE_LIMIT);
const hasRateLimit = Number.isSafeInteger(RATE_LIMIT) && RATE_LIMIT > 0;

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/");
  const isApiMutation = pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(req.method);

  if (isApiMutation && !isAuthRoute) {
    if (!hasRateLimit) return NextResponse.json({error:"Serviço de proteção temporariamente indisponível"},{status:503,headers:{"Cache-Control":"private, no-store"}});
    const requestOrigin = req.headers.get("origin");
    const allowedOrigins = new Set([
      req.nextUrl.origin.replace(/\/$/, ""),
      process.env.APP_BASE_URL?.replace(/\/$/, ""),
      process.env.SITE_URL?.replace(/\/$/, ""),
    ].filter((value): value is string => Boolean(value)));
    if (!requestOrigin || !allowedOrigins.has(requestOrigin.replace(/\/$/, ""))) {
      return NextResponse.json(
        { error: "Origem da requisição não autorizada.", code: "INVALID_REQUEST_ORIGIN" },
        { status: 403, headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const isRegistrationRoute = /^\/api\/v1\/events\/.*\/registration/i.test(pathname);
    const limitToApply = isRegistrationRoute ? 3 : Number(RATE_LIMIT);
    // Aluno logado é limitado pela própria conta; sem sessão, o limite continua por IP.
    const subject = (await getSession(req).catch(() => null))?.user?.sub;
    const { canAccess, unavailable } = await rateLimit(req, limitToApply, subject)

    if (unavailable && !canAccess) {
      return NextResponse.json(
        { error: "Serviço de proteção temporariamente indisponível" },
        { status: 503, headers: { "Cache-Control": "private, no-store" } },
      );
    }
    if (!canAccess) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Cache-Control": "private, no-store" },
      })
    }
  }

  if (pathname.startsWith("/panel")) {
    const session = await getSession(req).catch(() => null)
    if (!session) {
      return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${encodeURIComponent(pathname)}`, process.env.APP_BASE_URL || req.url));
    }
  }

  // Renova o access token antes de vencer e grava o cookie (Server Components não gravam).
  return await manterSessao(req)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
