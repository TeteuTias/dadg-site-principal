import { NextRequest, NextResponse } from "next/server";
import { applyBackendAuthentication, BackendSessionError, backendErrorStatus, fetchBackend, getBackendIdentity, readBackendJson } from "@/lib/backend";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

async function sessionOrResponse() {
  try {
    const identity = await getBackendIdentity();
    if (!identity) return { response: NextResponse.json({ error:"Não autenticado", code:"NOT_AUTHENTICATED" }, { status:401, headers }) };
    return { identity };
  } catch (error) {
    if (error instanceof BackendSessionError) return { response: NextResponse.json({ error:"Sua sessão expirou. Entre novamente.", code:error.code }, { status:401, headers }) };
    throw error;
  }
}
export async function GET(_request: NextRequest) {
  const resolved = await sessionOrResponse(); if ("response" in resolved) return resolved.response;
  try {
    const backendHeaders = new Headers({ Accept:"application/json" }); applyBackendAuthentication(backendHeaders, resolved.identity);
    const response = await fetchBackend("/api/v1/user/profile", { headers:backendHeaders, cache:"no-store" });
    const data = await readBackendJson(response);
    if (!response.ok) return NextResponse.json(data, { status:response.status, headers });
    return NextResponse.json({
      account: {
        email: typeof resolved.identity.user.email === "string" ? resolved.identity.user.email : "",
        picture: typeof resolved.identity.user.picture === "string" ? resolved.identity.user.picture : "",
        suggestedName: typeof resolved.identity.user.name === "string" ? resolved.identity.user.name : "",
      },
      profile: data.profile,
      privacyNotice: data.privacyNotice,
      events: Array.isArray(data.data) ? data.data : [],
    }, { headers });
  } catch(error) { return NextResponse.json({ error:"Erro ao conectar ao backend." }, { status:backendErrorStatus(error), headers }); }
}

export async function PUT(request: NextRequest) {
  const resolved = await sessionOrResponse(); if ("response" in resolved) return resolved.response;
  const body = await request.text();
  try {
    const backendHeaders = new Headers({ "Content-Type":"application/json", Accept:"application/json" }); applyBackendAuthentication(backendHeaders, resolved.identity);
    const response = await fetchBackend("/api/v1/user/profile", { method:"PUT", headers:backendHeaders, body, cache:"no-store" });
    const data = await readBackendJson(response);
    return NextResponse.json(data, { status:response.status, headers });
  } catch(error) { return NextResponse.json({ error:"Erro ao conectar ao backend." }, { status:backendErrorStatus(error), headers }); }
}
