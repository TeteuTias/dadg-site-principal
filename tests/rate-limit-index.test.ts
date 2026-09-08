import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureRateLimitIndex } from '../lib/rate-limit-index';
type Store = Parameters<typeof ensureRateLimitIndex>[0];
const ttl = { name: 'createdAt_1', key: { createdAt: 1 }, expireAfterSeconds: 604802 };
function fake(read: () => Promise<unknown[]>, create: (...args: unknown[]) => Promise<string>) {
  return { listIndexes: () => ({ toArray: read }), createIndex: create } as unknown as Store;
}
test('reuses the production TTL without renaming or changing retention', async () => {
  let creates=0;
  await ensureRateLimitIndex(fake(async()=>[ttl],async()=>{creates++;return '';}));
  assert.equal(creates,0); assert.equal(ttl.expireAfterSeconds,604802);
});
test('creates a TTL only when none exists', async () => {
  const calls: unknown[][]=[];
  await ensureRateLimitIndex(fake(async()=>[],async(...args)=>{calls.push(args);return 'rate_limit_ttl';}));
  assert.deepEqual(calls,[[{createdAt:1},{expireAfterSeconds:300,name:'rate_limit_ttl'}]]);
});
test('handles an absent collection', async () => {
  let created=false;
  await ensureRateLimitIndex(fake(async()=>{throw {code:26};},async()=>{created=true;return 'rate_limit_ttl';}));
  assert.equal(created,true);
});
test('accepts a concurrent compatible TTL creation', async () => {
  let reads=0;
  await ensureRateLimitIndex(fake(async()=>++reads===1?[]:[ttl],async()=>{throw {code:85};}));
  assert.equal(reads,2);
});
test('does not swallow permission failures', async () => {
  const error={code:13};
  await assert.rejects(ensureRateLimitIndex(fake(async()=>{throw error;},async()=>'')),e=>e===error);
});
test('does not accept incompatible indexes or hide a real conflict', async () => {
  for(const index of [{key:{createdAt:1}}, {...ttl,key:{createdAt:1,path:1}}, {...ttl,partialFilterExpression:{path:'/x'}}]) {
    const error={code:85};
    await assert.rejects(ensureRateLimitIndex(fake(async()=>[index],async()=>{throw error;})),e=>e===error);
  }
});
