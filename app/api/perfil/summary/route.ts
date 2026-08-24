import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import {
  applyBackendAuthentication,
  backendErrorStatus,
  fetchBackend,
  readBackendJson,
} from "@/lib/backend";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user || !session.tokenSet?.accessToken)
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401, headers },
    );
  try {
    const backendHeaders = new Headers();
    applyBackendAuthentication(backendHeaders, request, session);
    const response = await fetchBackend("/api/v1/user/profile/summary", {
      headers: backendHeaders,
      cache: "no-store",
    });
    const data = await readBackendJson(response);
    return NextResponse.json(data, { status: response.status, headers });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar o resumo do perfil." },
      { status: backendErrorStatus(error), headers },
    );
  }
}
