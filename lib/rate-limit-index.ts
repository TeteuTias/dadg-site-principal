import type { Collection } from "mongodb";

type IndexStore = Pick<Collection, "listIndexes" | "createIndex">;
function errorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error ? error.code : undefined;
}
async function hasTtlIndex(collection: IndexStore) {
  try {
    const indexes = await collection.listIndexes().toArray();
    return indexes.some(index => Object.keys(index.key).length === 1 && index.key.createdAt === 1
      && typeof index.expireAfterSeconds === "number" && Number.isFinite(index.expireAfterSeconds)
      && index.expireAfterSeconds >= 0 && !index.partialFilterExpression);
  } catch (error) {
    if (errorCode(error) === 26) return false; // Collection does not exist yet.
    throw error;
  }
}
export async function ensureRateLimitIndex(collection: IndexStore) {
  if (await hasTtlIndex(collection)) return;
  try {
    await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300, name: "rate_limit_ttl" });
  } catch (error) {
    // Another instance may have initialized the TTL while this one was starting.
    if ([85, 86].includes(Number(errorCode(error))) && await hasTtlIndex(collection)) return;
    throw error;
  }
}
