import { getRedisSubscriberClient } from "@repo/redis/config";
import { CHANNELS } from "./channels";

/**
 * Subscribe to a Redis channel and invoke handler on each message.
 * @param channel Key of the channel in CHANNELS
 * @param handler Callback invoked with the parsed message payload
 */
export async function subscribeToChannel(
  channel: keyof typeof CHANNELS,
  handler: (payload: any) => void
): Promise<void> {
  const client = await getRedisSubscriberClient();
  // Subscribe to the channel and process messages
  console.log(`Subscribing to channel: ${CHANNELS[channel]}`);
  
  await client.subscribe(CHANNELS[channel], (message: string) => {
    try {
      const data = JSON.parse(message);
      handler(data);
    } catch (err) {
      console.error(`Failed to parse message on ${channel}:`, err);
    }
  });
}
