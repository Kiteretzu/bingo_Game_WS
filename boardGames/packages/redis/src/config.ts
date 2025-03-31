// src/config.ts
import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config({ path: "../../.env" });

class RedisClientSingleton {
  private static instance: RedisClientType;

  private constructor() {} // Prevent instantiation

  public static async getInstance(): Promise<RedisClientType> {
    if (!RedisClientSingleton.instance) {
      RedisClientSingleton.instance = createClient({
        username: "default",
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT) || 6379,
        },
      });

      RedisClientSingleton.instance.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      try {
        await RedisClientSingleton.instance.connect();
        console.log("Connected to Redis Singleton");
      } catch (err) {
        console.error("Redis connection error:", err);
      }
    }
    return RedisClientSingleton.instance;
  }
}

export const redisClient = RedisClientSingleton.getInstance();
