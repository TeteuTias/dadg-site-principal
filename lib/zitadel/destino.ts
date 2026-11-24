const HOSTS = new Set(["www.dadg.com.br", "certificados.dadg.com.br", "www.congressocieps.com.br", "www.admin.congressocieps.com.br"]);

// O servidor de login só aceita voltar para /entrar/logout (sem query) e devolve ?state=: mapa fixo.
const POR_STATE: Record<string, string> = { certificados: "https://certificados.dadg.com.br/" };

/** Para onde ir depois do /entrar/logout: post_logout_redirect (allowlist), state conhecido ou a home do site. */
export function destinoDoLogout(q: URLSearchParams, base: string, producao?: boolean): string {
  const state = q.get("state") ?? "";
  return destinoPermitido(q.get("post_logout_redirect"), producao) ?? (Object.hasOwn(POR_STATE, state) ? POR_STATE[state] : `${base.replace(/\/$/, "")}/`);
}

/** Destino do logout: só os sites do DADG/CIEPS em https (e localhost fora de produção). */
export function destinoPermitido(valor: string | null, producao = process.env.NODE_ENV === "production"): string | null {
  if (!valor) return null;
  try {
    const url = new URL(valor);
    if (url.protocol === "https:" && HOSTS.has(url.hostname)) return url.toString();
    if (!producao && url.hostname === "localhost" && /^https?:$/.test(url.protocol)) return url.toString();
  } catch { /* não é URL absoluta */ }
  return null;
}
