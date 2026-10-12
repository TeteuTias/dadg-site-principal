import assert from "node:assert/strict";
import test from "node:test";
import { loadIsolated } from "./helpers/isolated";

test("limite de inscrição é por aluno logado e por IP só sem sessão", async () => {
  const previous = process.env.RATE_LIMIT;
  process.env.RATE_LIMIT = "60";
  try {
    const { NextRequest } = await import("next/server");
    const calls: Array<{ limit: number; subject?: string }> = [];
    let session: { user: { sub: string } } | null = { user: { sub: "auth0|aluno" } };
    const route = loadIsolated("proxy.ts", {
      "./app/src/lib/auth0/Auth0Client": {
        auth0: { getSession: async () => session },
      },
      "./lib/RateLimit": {
        rateLimit: async (_req: unknown, limit: number, subject?: string) => {
          calls.push({ limit, subject });
          return { canAccess: true };
        },
      },
    });
    const post = (path: string) =>
      route.proxy(
        new NextRequest(`https://fixture.invalid${path}`, {
          method: "POST",
          headers: { origin: "https://fixture.invalid" },
        }),
      );

    assert.equal((await post("/api/v1/events/6a92fab72fd46137ff827a87/registration")).status, 200);
    assert.equal((await post("/api/v1/selective-processes/6a92fab72fd46137ff827a87/checkout")).status, 200);
    session = null;
    assert.equal((await post("/api/ouvidoria")).status, 200);

    assert.deepEqual(calls, [
      { limit: 3, subject: "auth0|aluno" },
      { limit: 60, subject: "auth0|aluno" },
      { limit: 60, subject: undefined },
    ]);
  } finally {
    if (previous === undefined) delete process.env.RATE_LIMIT;
    else process.env.RATE_LIMIT = previous;
  }
});
