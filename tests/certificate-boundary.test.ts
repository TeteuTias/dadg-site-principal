import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/v1/certificates/bulk/route";
import { DELETE } from "../app/api/v1/certificates/[search]/delete/route";
test("escritas públicas são negadas sem tocar banco", async () => {
  assert.equal((await POST()).status, 410);
  assert.equal((await DELETE()).status, 410);
});
