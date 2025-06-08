// utils/redisLock.ts
import { getRedisClient } from "@repo/redis/config";

export async function acquireLock(
  key: string,
  ttlMs: number
): Promise<boolean> {
  const client = await getRedisClient();
  const result = await client.set(key, "locked", {
    NX: true,
    PX: ttlMs, // expires automatically to avoid deadlocks
  });
  return result === "OK";
}
