import "server-only";
import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";

export type SessaoGuardada = { sessionId: string; sessionToken: string; loginName: string; nome: string };
export type EstadoTela = { sessoes: SessaoGuardada[]; authRequest?: string };

const NOME = "dadg_entrar";
const VALIDADE = 14 * 24 * 60 * 60;
const MAX_SESSOES = 3; // cookie precisa caber em 4 KB

function chave() {
  const hex = process.env.ENTRAR_COOKIE_SECRET ?? "";
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error("ENTRAR_COOKIE_SECRET precisa ter 64 caracteres hexadecimais");
  return Uint8Array.from(hex.match(/../g)!.map((b) => parseInt(b, 16)));
}

export async function lerEstado(): Promise<EstadoTela> {
  const valor = (await cookies()).get(NOME)?.value;
  if (!valor) return { sessoes: [] };
  try {
    const { payload } = await jwtDecrypt(valor, chave());
    const sessoes = Array.isArray(payload.sessoes) ? (payload.sessoes as SessaoGuardada[]) : [];
    return { sessoes, authRequest: typeof payload.authRequest === "string" ? payload.authRequest : undefined };
  } catch {
    return { sessoes: [] }; // cookie velho, adulterado ou de outra chave
  }
}

/** Só funciona em Server Action ou route handler. */
export async function salvarEstado(estado: EstadoTela) {
  const jwt = await new EncryptJWT({ sessoes: estado.sessoes.slice(0, MAX_SESSOES), authRequest: estado.authRequest })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${VALIDADE}s`)
    .encrypt(chave());
  (await cookies()).set(NOME, jwt, {
    httpOnly: true,
    secure: !(process.env.ENTRAR_BASE_URL ?? "").startsWith("http://localhost"),
    sameSite: "lax",
    path: "/entrar",
    maxAge: VALIDADE,
  });
}

export async function apagarEstado() {
  (await cookies()).set(NOME, "", { path: "/entrar", maxAge: 0 });
}

/** Põe a sessão no topo (substituindo outra do mesmo login) e guarda o pedido em andamento. */
export async function guardarSessao(sessao: SessaoGuardada, authRequest?: string) {
  const atual = await lerEstado();
  await salvarEstado({
    sessoes: [sessao, ...atual.sessoes.filter((s) => s.loginName !== sessao.loginName && s.sessionId !== sessao.sessionId)],
    authRequest: authRequest ?? atual.authRequest,
  });
}

export async function guardarPedido(authRequest: string | undefined) {
  if (!authRequest) return;
  const atual = await lerEstado();
  if (atual.authRequest !== authRequest) await salvarEstado({ ...atual, authRequest });
}
