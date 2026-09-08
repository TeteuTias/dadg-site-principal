import { NextRequest, NextResponse } from "next/server";
import {
  applyBackendAuthentication,
  BackendSessionError,
  backendErrorStatus,
  fetchBackend,
  getBackendIdentity,
  readBackendJson,
} from "@/lib/backend";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET(_request: NextRequest) {
  let identity;
  try {
    identity = await getBackendIdentity();
  } catch (error) {
    if (error instanceof BackendSessionError)
      return NextResponse.json(
        { error: "Sua sessão expirou. Entre novamente.", code: error.code },
        { status: 401, headers },
      );
    throw error;
  }
  if (!identity)
    return NextResponse.json(
      { error: "Não autenticado", code: "NOT_AUTHENTICATED" },
      { status: 401, headers },
    );
  try {
    const backendHeaders = new Headers();
    applyBackendAuthentication(backendHeaders, identity);
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
