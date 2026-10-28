import { NextRequest, NextResponse } from "next/server";
import { applyBackendAuthentication, BackendSessionError, backendErrorStatus, fetchBackend, getBackendIdentity } from "@/lib/backend";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
// O vínculo automático percorre todos os certificados do CPF de uma vez; os 10 s
// padrão do proxy não bastam para quem tem muitos.
const SLOW_ROUTES_TIMEOUT_MS = 45_000;
const isSlowRoute = (method: string, path: string[]) =>
  method === "POST" && path.join("/") === "user/certificates/link";
// Teto da função no Vercel acima do timeout acima.
export const maxDuration = 60;
const RESPONSE_HEADERS = [
  "cache-control",
  "content-disposition",
  "content-type",
  "etag",
  "last-modified",
];

async function forwardRequest(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  const targetPath = `/api/v1/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers = new Headers();

  for (const name of ["accept", "content-type", "idempotency-key"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let sessionError: BackendSessionError | null = null;
  try {
    const identity = await getBackendIdentity();
    applyBackendAuthentication(headers, identity);
  } catch (error) {
    // Este proxy também atende leituras públicas. Se a sessão estiver expirada,
    // segue sem Authorization, mas guarda a causa: quando o backend recusar por
    // falta de credencial, respondemos com AUTH_SESSION_EXPIRED em vez de
    // mascarar a falha como "não autenticado".
    if (error instanceof BackendSessionError) {
      sessionError = error;
      headers.delete("authorization");
    } else throw error;
  }

  try {
    const upstream = await fetchBackend(
      targetPath,
      {
        method: request.method,
        headers,
        body: SAFE_METHODS.has(request.method) ? undefined : await request.arrayBuffer(),
        cache: "no-store",
      },
      isSlowRoute(request.method, path) ? SLOW_ROUTES_TIMEOUT_MS : undefined,
    );

    if (sessionError && upstream.status === 401) {
      return NextResponse.json(
        { error: "Sua sessão expirou. Entre novamente.", code: sessionError.code },
        { status: 401, headers: { "cache-control": "private, no-store" } },
      );
    }

    const responseHeaders = new Headers({ "cache-control": "private, no-store" });
    for (const name of RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const status = backendErrorStatus(error);
    return NextResponse.json(
      { error: status === 504 ? "Tempo limite do backend excedido" : "Erro ao conectar ao backend" },
      { status },
    );
  }
}

export const GET = forwardRequest;
export const HEAD = forwardRequest;
export const OPTIONS = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;
