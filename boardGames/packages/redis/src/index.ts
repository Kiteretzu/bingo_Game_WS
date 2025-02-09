import { client } from "@repo/db/client";
import { createClient, RedisClientType } from "redis";
import { DbManagerQueue } from "./services/dbManagerQueue";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis.");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  try {
    console.log("Disconnecting Redis...");
    await redisClient.disconnect();
    console.log("Redis disconnected. Exiting.");
  } catch (err) {
    console.error("Error during Redis disconnection:", err);
  } finally {
    process.exit(0);
  }
});

async function startApp() {
  await connectToRedis(); // Ensure Redis is ready
  const dbManagerQueue = new DbManagerQueue();
  try {
    await dbManagerQueue.processRequests();
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

startApp();

export { redisClient };
