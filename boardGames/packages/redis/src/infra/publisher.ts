// packages/redis/services/publisher.ts
import { getRedisClient } from "@repo/redis/config";
import { CHANNELS } from "./channels";

/**
 * Publish a JSON‐serializable payload to any channel.
 */
export async function publishToChannel(
  channel: keyof typeof CHANNELS,
  message: unknown
): Promise<void> { 
  const client = await getRedisClient();
  await client.publish(CHANNELS[channel], JSON.stringify(message));
}

/**
 * Convenience wrappers if you want per-channel helpers:
 */
export const publishFriendRequest = (msg: unknown) =>
  publishToChannel("FRIEND_REQUEST", msg);

export const publishMatchmaking = (msg: unknown) =>
  publishToChannel("MATCHMAKING", msg);

export const publishChallenge = (msg: unknown) =>
  publishToChannel("CHALLENGE", msg);
