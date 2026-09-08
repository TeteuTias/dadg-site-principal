import { NextRequest, NextResponse } from "next/server";
import { applyBackendAuthentication, BackendSessionError, backendErrorStatus, fetchBackend, getBackendIdentity, readBackendJson } from "@/lib/backend";

export const dynamic = "force-dynamic";
interface RouteParams { params: Promise<{ id: string }> }
const headers = { "Cache-Control": "private, no-store" };

async function forward(req: NextRequest, { params }: RouteParams, method: "POST" | "DELETE") {
  let identity;
  try { identity = await getBackendIdentity(); }
  catch (error) { if (error instanceof BackendSessionError) return NextResponse.json({ error:"Sua sessão expirou. Entre novamente.", code:error.code }, { status:401, headers }); throw error; }
  if (!identity) return NextResponse.json({ error:"Não autenticado.", code:"NOT_AUTHENTICATED" }, { status:401, headers });
  const { id } = await params;
  try {
    const backendHeaders = new Headers({ Accept:"application/json" });
    applyBackendAuthentication(backendHeaders, identity);
    const response = await fetchBackend(`/api/v1/events/${encodeURIComponent(id)}/registration`, { method, headers:backendHeaders, cache:"no-store" });
    const data = await readBackendJson(response);
    return NextResponse.json(data, { status:response.status, headers });
  } catch(error) {
    const status=backendErrorStatus(error);
    return NextResponse.json({ error:status===504?"Tempo limite do servidor excedido.":"Erro ao conectar ao servidor." }, { status, headers });
  }
}
export function POST(req: NextRequest, context: RouteParams) { return forward(req, context, "POST"); }
export function DELETE(req: NextRequest, context: RouteParams) { return forward(req, context, "DELETE"); }
