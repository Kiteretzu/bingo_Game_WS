import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config({ path: "../../.env" });

class RedisClientSingleton {
  private static instance: RedisClientType | null = null;
  private static connectionPromise: Promise<RedisClientType> | null = null;

  private constructor() {} // Prevent instantiation

  public static async getInstance(): Promise<RedisClientType> {
    // If we already have an instance, return it
    if (RedisClientSingleton.instance && RedisClientSingleton.instance.isOpen) {
      return RedisClientSingleton.instance;
    }

    // If we're in the process of connecting, return the promise
    if (RedisClientSingleton.connectionPromise) {
      return RedisClientSingleton.connectionPromise;
    }

    // Create a new connection promise
    RedisClientSingleton.connectionPromise = (async () => {
      try {
     
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
          // Reset the instance if there's an error so we can try to reconnect
          if (RedisClientSingleton.instance === client) {
            RedisClientSingleton.instance = null;
          }
        });

        // Set up reconnection logic
        client.on("end", () => {
          console.log("Redis connection closed");
          if (RedisClientSingleton.instance === client) {
            RedisClientSingleton.instance = null;
          }
        });

        await client.connect();
        console.log("Connected to Redis Singleton");

        RedisClientSingleton.instance = client;
        return client;
      } catch (err) {
        console.error("Redis connection error:", err);
        // Reset the connection promise so we can try again
        RedisClientSingleton.connectionPromise = null;
        throw err;
      }
    })();

    return RedisClientSingleton.connectionPromise;
  }
}

// Export a function that returns the promise instead of using top-level await
export const getRedisClient: () => Promise<RedisClientType> = () =>
  RedisClientSingleton.getInstance();
