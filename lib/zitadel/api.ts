import "server-only";

/** Erro da API do servidor de login. `message` é técnico: nunca mostrar ao usuário nem logar com dados pessoais. */
export class ZitadelError extends Error {
  constructor(public status: number, public code: number | undefined, message: string) {
    super(message);
  }
  get naoEncontrado() { return this.status === 404 || this.code === 5; }
  get jaExiste() { return this.status === 409 || this.code === 6; }
  /** Ao finalizar um pedido de login: 400 FailedPrecondition = esse pedido já foi finalizado. */
  get jaFinalizado() { return this.status === 400 && this.code === 9; }
  get bloqueado() { return /locked|blocked|bloquead/i.test(this.message); }
  get senhaInvalida() { return /password.*invalid|invalid.*password|senha.*inv/i.test(this.message); }
  get codigoInvalido() { return /code.*(invalid|expired)|(invalid|expired).*code|c[oó]digo/i.test(this.message); }
}

function env(nome: string) {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável de ambiente ausente: ${nome}`);
  return valor;
}

export const baseUrl = () => env("ENTRAR_BASE_URL").replace(/\/$/, "");
export const googleIdpId = () => env("ZITADEL_GOOGLE_IDP_ID");

/** Chamada à API do Zitadel. `rotulo` vai para o log no lugar do caminho real (que pode ter IDs). */
async function chamar<T>(metodo: string, caminho: string, rotulo: string, corpo?: unknown): Promise<T> {
  const url = `${env("ZITADEL_API_URL").replace(/\/$/, "")}${caminho}`;
  const token = env("ZITADEL_LOGIN_TOKEN");
  let resposta: Response;
  try {
    resposta = await fetch(url, {
      method: metodo,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      cache: "no-store",
    });
  } catch {
    console.error(`[zitadel] ${rotulo}: falha de rede`);
    throw new ZitadelError(503, undefined, "network");
  }
  const texto = await resposta.text();
  let json: Record<string, unknown> = {};
  try { json = texto ? JSON.parse(texto) : {}; } catch { /* resposta não-JSON */ }
  if (!resposta.ok) {
    const code = typeof json.code === "number" ? json.code : undefined;
    console.error(`[zitadel] ${rotulo}: HTTP ${resposta.status} code=${code ?? "-"}`);
    throw new ZitadelError(resposta.status, code, typeof json.message === "string" ? json.message : "");
  }
  return json as T;
}

const id = (valor: string) => encodeURIComponent(valor);

export type AuthRequest = { id: string; clientId: string; scope?: string[]; redirectUri: string; prompt?: string[]; loginHint?: string };
export type Sessao = { sessionId: string; sessionToken: string };
export type SessaoDetalhe = {
  id: string;
  expirationDate?: string;
  factors?: { user?: { id: string; loginName?: string; displayName?: string; verifiedAt?: string }; password?: { verifiedAt?: string }; intent?: { verifiedAt?: string } };
};
export type Complexidade = { minLength?: string | number; requiresUppercase?: boolean; requiresLowercase?: boolean; requiresNumber?: boolean; requiresSymbol?: boolean };
export type IdpInfo = { idpId: string; userId: string; userName?: string; rawInformation?: Record<string, unknown> };
/** Pedido de criação que o Zitadel já monta no retorno do Google (profile, email, idpLinks...). */
export type AddHumanUser = {
  username?: string;
  profile?: { givenName?: string; familyName?: string; displayName?: string; [k: string]: unknown };
  email?: { email?: string; isVerified?: boolean; [k: string]: unknown };
  idpLinks?: Array<{ idpId?: string; userId?: string; userName?: string }>;
  [k: string]: unknown;
};

// Sessões duram o mesmo que o cookie da tela.
const LIFETIME = "1209600s";

export const zitadel = {
  lerPedido: (authRequestId: string) =>
    chamar<{ authRequest: AuthRequest }>("GET", `/v2/oidc/auth_requests/${id(authRequestId)}`, "ler pedido").then((r) => r.authRequest),
  finalizarPedido: (authRequestId: string, sessao: Sessao) =>
    chamar<{ callbackUrl: string }>("POST", `/v2/oidc/auth_requests/${id(authRequestId)}`, "finalizar pedido", { session: sessao }).then((r) => r.callbackUrl),

  sessaoComSenha: (loginName: string, password: string) =>
    chamar<Sessao>("POST", "/v2/sessions", "sessão com senha", { checks: { user: { loginName }, password: { password } }, lifetime: LIFETIME }),
  sessaoComIdp: (userId: string, idpIntentId: string, idpIntentToken: string) =>
    chamar<Sessao>("POST", "/v2/sessions", "sessão com Google", { checks: { user: { userId }, idpIntent: { idpIntentId, idpIntentToken } }, lifetime: LIFETIME }),
  lerSessao: (sessionId: string) =>
    chamar<{ session: SessaoDetalhe }>("GET", `/v2/sessions/${id(sessionId)}`, "ler sessão").then((r) => r.session),
  encerrarSessao: (sessao: Sessao) =>
    chamar("DELETE", `/v2/sessions/${id(sessao.sessionId)}`, "encerrar sessão", { sessionToken: sessao.sessionToken }),

  buscarPorEmail: (email: string) =>
    chamar<{ result?: Array<{ userId: string }> }>("POST", "/v2/users", "buscar usuário", { queries: [{ emailQuery: { emailAddress: email, method: "TEXT_QUERY_METHOD_EQUALS_IGNORE_CASE" } }] })
      .then((r) => r.result?.[0]?.userId ?? null),
  lerUsuario: (userId: string) =>
    chamar<{ user: { userId: string; human?: { profile?: { givenName?: string; familyName?: string; displayName?: string }; email?: { email?: string; isVerified?: boolean } } } }>(
      "GET", `/v2/users/${id(userId)}`, "ler usuário").then((r) => r.user),
  criarUsuario: (dados: { email: string; givenName: string; familyName: string; password: string }) =>
    chamar<{ userId: string }>("POST", "/v2/users/human", "criar usuário", {
      username: dados.email,
      profile: { givenName: dados.givenName, familyName: dados.familyName },
      email: { email: dados.email, sendCode: { urlTemplate: urlVerificarEmail() } },
      password: { password: dados.password, changeRequired: false },
    }).then((r) => r.userId),
  /** Cria a conta a partir do addHumanUser do Zitadel; e-mail não garantido pelo Google recebe código. */
  criarUsuarioIdp: (base: AddHumanUser, email: string) =>
    chamar<{ userId: string }>("POST", "/v2/users/human", "criar usuário Google", {
      ...base,
      username: email,
      email: base.email?.isVerified === true ? { email, isVerified: true } : { email, sendCode: { urlTemplate: urlVerificarEmail() } },
    }).then((r) => r.userId),
  ligarIdp: (userId: string, idp: IdpInfo) =>
    chamar("POST", `/v2/users/${id(userId)}/links`, "ligar Google", { idpLink: { idpId: idp.idpId, userId: idp.userId, userName: idp.userName } }),

  verificarEmail: (userId: string, verificationCode: string) =>
    chamar("POST", `/v2/users/${id(userId)}/email/verify`, "verificar e-mail", { verificationCode }),
  reenviarEmail: (userId: string) =>
    chamar("POST", `/v2/users/${id(userId)}/email/resend`, "reenviar e-mail", { sendCode: { urlTemplate: urlVerificarEmail() } }),
  pedirNovaSenha: (userId: string) =>
    chamar("POST", `/v2/users/${id(userId)}/password_reset`, "esqueci a senha", {
      sendLink: { notificationType: "NOTIFICATION_TYPE_Email", urlTemplate: `${baseUrl()}/entrar/nova-senha?userId={{.UserID}}&code={{.Code}}` },
    }),
  definirSenha: (userId: string, password: string, verificationCode: string) =>
    chamar("POST", `/v2/users/${id(userId)}/password`, "nova senha", { newPassword: { password, changeRequired: false }, verificationCode }),

  complexidade: () =>
    chamar<{ settings?: Complexidade }>("GET", "/v2/settings/password/complexity", "regras de senha").then((r) => r.settings ?? {}),
  configLogin: () =>
    chamar<{ settings?: { allowRegister?: boolean; allowExternalIdp?: boolean } }>("GET", "/v2/settings/login", "config de login").then((r) => r.settings ?? {}),

  iniciarGoogle: (authRequest: string) =>
    chamar<{ authUrl?: string }>("POST", "/v2/idp_intents", "iniciar Google", {
      idpId: googleIdpId(),
      urls: {
        successUrl: `${baseUrl()}/entrar/google?authRequest=${id(authRequest)}`,
        failureUrl: `${baseUrl()}/entrar/login?authRequest=${id(authRequest)}&erro=google`,
      },
    }).then((r) => r.authUrl),
  retornoGoogle: (idpIntentId: string, idpIntentToken: string) =>
    chamar<{ idpInformation?: IdpInfo; userId?: string; addHumanUser?: AddHumanUser }>("POST", `/v2/idp_intents/${id(idpIntentId)}`, "retorno Google", { idpIntentToken }),
};

function urlVerificarEmail() {
  return `${baseUrl()}/entrar/verificar-email?userId={{.UserID}}&code={{.Code}}`;
}

/** Sessão ainda serve para SSO: tem usuário e não expirou. */
export function sessaoValida(s: SessaoDetalhe | null | undefined) {
  if (!s?.factors?.user?.id) return false;
  return !s.expirationDate || new Date(s.expirationDate).getTime() > Date.now();
}
