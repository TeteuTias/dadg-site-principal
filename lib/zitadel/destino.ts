const HOSTS = new Set(["www.dadg.com.br", "certificados.dadg.com.br", "www.congressocieps.com.br", "www.admin.congressocieps.com.br"]);

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
