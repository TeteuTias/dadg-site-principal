import "server-only";

type BackendSession = {
  user?: { email?: string | null } | null;
  tokenSet?: { accessToken?: string | null } | null;
} | null;

export const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");
export const BACKEND_TIMEOUT_MS = 10_000;

export class BackendTimeoutError extends Error {
  constructor() {
    super("Backend request timed out");
    this.name = "BackendTimeoutError";
  }
}

export function applyBackendAuthentication(
  headers: Headers,
  _request: unknown,
  session: BackendSession,
) {
  const accessToken = session?.tokenSet?.accessToken;
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
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
