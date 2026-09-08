import "server-only";
import { auth0 } from "@/app/src/lib/auth0/Auth0Client";

export type BackendIdentity = {
  user: { email?: string | null; name?: string | null; picture?: string | null };
  accessToken: string;
};

export const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");
export const BACKEND_TIMEOUT_MS = 10_000;

export class BackendTimeoutError extends Error {
  constructor() {
    super("Backend request timed out");
    this.name = "BackendTimeoutError";
  }
}

export class BackendSessionError extends Error {
  readonly code: "AUTH_SESSION_EXPIRED";

  constructor() {
    super("The authenticated session could not provide an access token");
    this.name = "BackendSessionError";
    this.code = "AUTH_SESSION_EXPIRED";
  }
}

export async function getBackendIdentity(): Promise<BackendIdentity | null> {
  const session = await auth0.getSession().catch(() => null);
  if (!session?.user) return null;

  try {
    const { token } = await auth0.getAccessToken();
    if (!token) throw new BackendSessionError();
    return { user: session.user, accessToken: token };
  } catch (error) {
    if (error instanceof BackendSessionError) throw error;
    throw new BackendSessionError();
  }
}

export function applyBackendAuthentication(
  headers: Headers,
  identity: BackendIdentity | null,
) {
  if (identity) headers.set("authorization", `Bearer ${identity.accessToken}`);
}

export async function fetchBackend(
  path: string,
  init: RequestInit = {},
  timeoutMs = BACKEND_TIMEOUT_MS,
) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  try {
    return await fetch(`${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      signal: init.signal || timeoutSignal,
    });
  } catch (error) {
    if (
      timeoutSignal.aborted ||
      (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError"))
    ) {
      throw new BackendTimeoutError();
    }
    throw error;
  }
}

export async function readBackendJson(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { error: text };
  }
}

export function backendErrorStatus(error: unknown) {
  return error instanceof BackendTimeoutError ? 504 : 502;
}
