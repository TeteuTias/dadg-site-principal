import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";
import { applyBackendAuthentication, backendErrorStatus, fetchBackend, readBackendJson } from "@/lib/backend";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

async function sessionOrResponse() {
  const session = await auth0.getSession();
  if (!session?.user || !session.tokenSet?.accessToken) return { response: NextResponse.json({ error:"Não autenticado", code:"NOT_AUTHENTICATED" }, { status:401, headers }) };
  return { session };
}
export async function GET(request: NextRequest) {
  const resolved = await sessionOrResponse(); if ("response" in resolved) return resolved.response;
  try {
    const backendHeaders = new Headers({ Accept:"application/json" }); applyBackendAuthentication(backendHeaders, request, resolved.session);
    const response = await fetchBackend("/api/v1/user/profile", { headers:backendHeaders, cache:"no-store" });
    const data = await readBackendJson(response);
    if (!response.ok) return NextResponse.json(data, { status:response.status, headers });
    return NextResponse.json({
      account: {
        email: typeof resolved.session.user.email === "string" ? resolved.session.user.email : "",
        picture: typeof resolved.session.user.picture === "string" ? resolved.session.user.picture : "",
        suggestedName: typeof resolved.session.user.name === "string" ? resolved.session.user.name : "",
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
    const backendHeaders = new Headers({ "Content-Type":"application/json", Accept:"application/json" }); applyBackendAuthentication(backendHeaders, request, resolved.session);
    const response = await fetchBackend("/api/v1/user/profile", { method:"PUT", headers:backendHeaders, body, cache:"no-store" });
    const data = await readBackendJson(response);
    return NextResponse.json(data, { status:response.status, headers });
  } catch(error) { return NextResponse.json({ error:"Erro ao conectar ao backend." }, { status:backendErrorStatus(error), headers }); }
}
