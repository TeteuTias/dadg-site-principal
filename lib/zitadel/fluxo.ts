import "server-only";
import { zitadel, ZitadelError, type AuthRequest, type Sessao } from "./api";
import { REGRAS_PADRAO, type Regras } from "./senha";

/** `ir`: o navegador vai para lá. `voltar`: link "Entrar" mostrado junto do `ok`. */
export type Resultado = { erro?: string; ok?: string; ir?: string; voltar?: string; campos?: Record<string, string> };

export const ERRO_SERVIDOR = "Não foi possível falar com o servidor de login agora. Tente de novo em instantes.";
export const ERRO_PEDIDO = "Este pedido de login expirou ou não é válido. Volte ao site e clique em “Entrar” de novo.";

/** Mensagem amigável para um erro qualquer, sem detalhes internos. */
export function mensagem(e: unknown, padrao = "Algo deu errado. Tente de novo.") {
  if (!(e instanceof ZitadelError)) {
    console.error("[entrar] erro inesperado:", e instanceof Error ? e.name : typeof e);
    return ERRO_SERVIDOR;
  }
  if (e.status >= 500 || e.status === 401 || e.status === 403) return ERRO_SERVIDOR;
  return padrao;
}

export const pedidoValido = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{1,200}$/.test(v);

/** prompt vem como "login" (OIDC) ou "PROMPT_LOGIN" (API v2). */
export const temPrompt = (pedido: AuthRequest, valor: string) =>
  (pedido.prompt ?? []).some((p) => p.toLowerCase().replace(/^prompt_/, "") === valor);

const SITES: Record<string, string> = {
  "www.dadg.com.br": "Site do DADG",
  "dadg.com.br": "Site do DADG",
  "certificados.dadg.com.br": "Certificados DADG",
  "www.congressocieps.com.br": "Congresso CIEPS",
  "congressocieps.com.br": "Congresso CIEPS",
  "www.admin.congressocieps.com.br": "Painel do Congresso CIEPS",
  "admin.congressocieps.com.br": "Painel do Congresso CIEPS",
};

/** Nome do site que pediu o login, a partir do redirectUri. */
export function siteDoPedido(pedido: AuthRequest) {
  try {
    const host = new URL(pedido.redirectUri).hostname;
    if (host === "localhost" || host === "127.0.0.1") return "Ambiente de testes (localhost)";
    return Object.hasOwn(SITES, host) ? SITES[host] : host;
  } catch {
    return undefined;
  }
}

/** Origem do site que pediu o login, para o "Voltar para o site" (só sites conhecidos). */
export function origemDoPedido(pedido: AuthRequest) {
  try {
    const url = new URL(pedido.redirectUri);
    if (Object.hasOwn(SITES, url.hostname) || url.hostname === "localhost") return url.origin;
  } catch { /* redirectUri inválido */ }
  return undefined;
}

/**
 * Finaliza o pedido de login com a sessão, desde que o e-mail esteja confirmado.
 * Devolve para onde mandar o navegador: o callbackUrl do servidor ou a tela de confirmar e-mail.
 */
export async function finalizar(authRequest: string, sessao: Sessao): Promise<string> {
  const detalhe = await zitadel.lerSessao(sessao.sessionId);
  const userId = detalhe.factors?.user?.id;
  if (!userId) throw new ZitadelError(400, undefined, "session without user");
  const usuario = await zitadel.lerUsuario(userId);
  // Sem verificação o Zitadel omite isVerified: ausente = não verificado.
  if (usuario.human?.email?.isVerified !== true) return `/entrar/verificar-email?userId=${encodeURIComponent(userId)}`;
  return zitadel.finalizarPedido(authRequest, sessao);
}

export async function lerRegras(): Promise<Regras> {
  try {
    const c = await zitadel.complexidade();
    const min = Number(c.minLength);
    return {
      min: Number.isFinite(min) && min > 0 ? min : REGRAS_PADRAO.min,
      maiuscula: Boolean(c.requiresUppercase),
      minuscula: Boolean(c.requiresLowercase),
      numero: Boolean(c.requiresNumber),
      simbolo: Boolean(c.requiresSymbol),
    };
  } catch {
    return REGRAS_PADRAO;
  }
}

export async function lerConfig() {
  try {
    const s = await zitadel.configLogin();
    return { cadastro: s.allowRegister !== false, google: s.allowExternalIdp !== false };
  } catch {
    return { cadastro: true, google: true };
  }
}

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const texto = (fd: FormData, nome: string) => String(fd.get(nome) ?? "").trim();
