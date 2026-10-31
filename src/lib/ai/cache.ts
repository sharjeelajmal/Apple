import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/mongodb";

type CacheDocument = {
  key: string;
  value: unknown;
  createdAt: Date;
  expiresAt: Date;
};

const HOUR_MS = 60 * 60 * 1000;
const cacheCollection = db.collection<CacheDocument>("ai_cache");
let indexesReady: Promise<unknown> | null = null;

const ensureIndexes = () =>
  (indexesReady ??= Promise.all([
    cacheCollection.createIndex({ key: 1 }, { unique: true }),
    cacheCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]));

export const cacheKey = (scope: string, ...parts: unknown[]) =>
  `${scope}:${createHash("sha256").update(JSON.stringify(parts)).digest("hex").slice(0, 32)}`;

export async function cachedAi<T>(key: string, ttlHours: number, generate: () => Promise<T>): Promise<T> {
  await ensureIndexes();

  const cached = await cacheCollection.findOne({ key, expiresAt: { $gt: new Date() } });
  if (cached) return cached.value as T;

  const value = await generate();
  const now = new Date();
  await cacheCollection.updateOne(
    { key },
    { $set: { value, createdAt: now, expiresAt: new Date(now.getTime() + ttlHours * HOUR_MS) } },
    { upsert: true }
  );
  return value;
}
