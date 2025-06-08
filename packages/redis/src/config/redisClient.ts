import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config({ path: "../../.env" });

class RedisClientSingleton {
  private static commandClient: RedisClientType | null = null;
  private static subscriberClient: RedisClientType | null = null;
  // Redis client for queue workers
  private static queueClient: RedisClientType | null = null;

  private static async createRedisClient(): Promise<RedisClientType> {
    const client: RedisClientType = createClient({
      username: "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });

    client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await client.connect();
    console.log("Connected to Redis");
    return client;
  }

  // Get Redis client for general commands
  public static async getCommandClient(): Promise<RedisClientType> {
    if (!RedisClientSingleton.commandClient) {
      RedisClientSingleton.commandClient =
        await RedisClientSingleton.createRedisClient();
    }
    return RedisClientSingleton.commandClient;
  }

  // Get Redis client for pub/sub
  public static async getSubscriberClient(): Promise<RedisClientType> {
    if (!RedisClientSingleton.subscriberClient) {
      RedisClientSingleton.subscriberClient =
        await RedisClientSingleton.createRedisClient();
    }
    return RedisClientSingleton.subscriberClient;
  }

  // Get Redis client for task queue consumption
  public static async getQueueClient(): Promise<RedisClientType> {
    if (!RedisClientSingleton.queueClient) {
      RedisClientSingleton.queueClient = await RedisClientSingleton.createRedisClient();
    }
    return RedisClientSingleton.queueClient;
  }
}

// Export functions to get Redis clients
export const getRedisClient = () =>
  RedisClientSingleton.getCommandClient();
export const getRedisSubscriberClient = () =>
  RedisClientSingleton.getSubscriberClient(); // only for subscribing

export const getRedisQueueClient = () =>
  RedisClientSingleton.getQueueClient();
