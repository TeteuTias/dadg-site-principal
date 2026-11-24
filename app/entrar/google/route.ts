import { NextRequest, NextResponse } from "next/server";
import { baseUrl, zitadel, ZitadelError, type AddHumanUser, type IdpInfo } from "@/lib/zitadel/api";
import { guardarSessao, lerEstado, salvarEstado } from "@/lib/zitadel/cookie";
import { finalizar, pedidoValido } from "@/lib/zitadel/fluxo";

export const dynamic = "force-dynamic";

/** Retorno do Google: o Zitadel acrescenta ?id=<idpIntentId>&token=<idpIntentToken> ao successUrl. */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const authRequest = pedidoValido(q.get("authRequest")) ? q.get("authRequest")! : undefined;
  const intentId = q.get("id") ?? "";
  const intentToken = q.get("token") ?? "";
  const falha = `/entrar/login?${authRequest ? `authRequest=${authRequest}&` : ""}erro=google`;

  let destino = falha;
  try {
    if (!intentId || !intentToken) throw new ZitadelError(400, undefined, "missing intent");
    const retorno = await zitadel.retornoGoogle(intentId, intentToken);
    const info = retorno.idpInformation;
    if (!info?.idpId || !info.userId) throw new ZitadelError(400, undefined, "missing idpInformation");

    // O Zitadel já devolve o pedido de criação pronto (addHumanUser); rawInformation fica só como reserva.
    const base: AddHumanUser = retorno.addHumanUser ?? deRawInformation(info);
    const email = (base.email?.email ?? "").trim().toLowerCase();
    const verificado = base.email?.isVerified === true;
    if (!base.idpLinks?.length) base.idpLinks = [{ idpId: info.idpId, userId: info.userId, userName: info.userName }];
    if (!base.profile?.givenName) base.profile = { ...base.profile, givenName: email.split("@")[0] || "Participante" };
    if (!base.profile?.familyName) base.profile = { ...base.profile, familyName: "-" };

    let userId = retorno.userId;
    if (!userId) {
      if (!email) throw new ZitadelError(400, undefined, "google without email");
      const existente = await zitadel.buscarPorEmail(email);
      if (existente) {
        // Só liga a conta Google a uma conta existente se o Google garante o e-mail.
        if (!verificado) throw new ZitadelError(400, undefined, "unverified google email for existing user");
        await zitadel.ligarIdp(existente, info);
        userId = existente;
      } else {
        userId = await zitadel.criarUsuarioIdp(base, email);
      }
    }
    const nome = [base.profile?.givenName, base.profile?.familyName !== "-" ? base.profile?.familyName : ""].filter(Boolean).join(" ");

    const sessao = await zitadel.sessaoComIdp(userId, intentId, intentToken);
    await guardarSessao({ ...sessao, loginName: email || info.userName || "", nome }, authRequest);

    if (!authRequest) {
      destino = "/entrar/login";
    } else {
      destino = await finalizar(authRequest, sessao);
      if (!destino.startsWith("/entrar/")) {
        const atual = await lerEstado();
        await salvarEstado({ ...atual, authRequest: undefined });
      }
    }
  } catch (e) {
    // Sem dados pessoais no log: só o tipo/estado do erro.
    console.error("[entrar] retorno do Google falhou:", e instanceof ZitadelError ? `HTTP ${e.status} code=${e.code ?? "-"}` : e instanceof Error ? e.name : typeof e);
    destino = falha;
  }
  return NextResponse.redirect(destino.startsWith("/") ? new URL(destino, baseUrl()) : destino);
}

/** Reserva, se o Zitadel não mandar addHumanUser: claims do Google (às vezes embrulhadas em "User"). */
function deRawInformation(info: IdpInfo): AddHumanUser {
  const raw = (info.rawInformation ?? {}) as Record<string, unknown>;
  const c = (raw.User && typeof raw.User === "object" ? raw.User : raw) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    profile: { givenName: str(c.given_name), familyName: str(c.family_name) },
    email: { email: str(c.email), isVerified: c.email_verified === true || c.email_verified === "true" },
  };
}
