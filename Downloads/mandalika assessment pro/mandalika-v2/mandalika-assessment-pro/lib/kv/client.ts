/* Lightweight KV wrapper with graceful fallback to in-memory store when Vercel KV env is absent.
 * This keeps local/dev and demo deploys working without real Redis.
 */
import { kv as vercelKv } from '@vercel/kv';

type ScoreMember = { score: number; member: string };

// Re-use a global map to persist across module reloads in dev
const mem = (() => {
  const g = globalThis as any;
  if (!g.__mandalikaMemKV) g.__mandalikaMemKV = new Map<string, any>();
  if (!g.__mandalikaMemIndex) g.__mandalikaMemIndex = [] as ScoreMember[];
  return { store: g.__mandalikaMemKV as Map<string, any>, index: g.__mandalikaMemIndex as ScoreMember[] };
})();

const hasVercelKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function kvGet<T>(key: string): Promise<T | null> {
  if (hasVercelKV) return (await vercelKv.get<T>(key)) ?? null;
  return (mem.store.has(key) ? (mem.store.get(key) as T) : null);
}

export async function kvMGet<T>(keys: string[]): Promise<(T | null)[]> {
  if (hasVercelKV) return (await vercelKv.mget<T>(...keys)) as (T | null)[];
  return keys.map((k) => (mem.store.has(k) ? (mem.store.get(k) as T) : null));
}

export async function kvSet(key: string, value: any) {
  if (hasVercelKV) return vercelKv.set(key, value);
  mem.store.set(key, value);
}

export async function kvDel(key: string) {
  if (hasVercelKV) return vercelKv.del(key);
  mem.store.delete(key);
}

export async function kvZAdd(indexKey: string, entry: ScoreMember) {
  if (hasVercelKV) return vercelKv.zadd(indexKey, entry);
  mem.index.push(entry);
  mem.index.sort((a, b) => a.score - b.score);
}

export async function kvZRange(indexKey: string, start: number, end: number): Promise<string[]> {
  if (hasVercelKV) return (await vercelKv.zrange(indexKey, start, end)) as unknown as string[];
  const slice = mem.index.slice(start < 0 ? mem.index.length + start : start, end + 1);
  return slice.map((i) => i.member);
}

export async function kvZRem(indexKey: string, member: string) {
  if (hasVercelKV) return vercelKv.zrem(indexKey, member);
  const idx = mem.index.findIndex((e) => e.member === member);
  if (idx >= 0) mem.index.splice(idx, 1);
}
