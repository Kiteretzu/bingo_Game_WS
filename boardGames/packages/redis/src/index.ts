import { client } from "@repo/db/client";
import { createClient, RedisClientType } from "redis";
import { DbManagerQueue } from "./services/dbManagerQueue";
import { MatchmakingService } from "./services/matchMakingServices";
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

// Graceful shutdown handler
process.on("SIGINT", async () => {
  try {
    console.log("Shutting down services...");
    await redisClient.disconnect();
    console.log("Redis disconnected.");

    // Stop the matchmaking interval if it's running
    if (global.matchmakingInterval) {
      clearInterval(global.matchmakingInterval);
      console.log("Matchmaking service stopped.");
    }
  } catch (err) {
    console.error("Error during shutdown:", err);
  } finally {
    process.exit(0);
  }
});

async function startMatchmaking() {
  const matchmakingService = MatchmakingService.getInstance();

  // Run initial match finding
  await matchmakingService.findMatch();

  // Set up continuous matchmaking
  const MATCHMAKING_INTERVAL = 10000; // Run every 10 seconds
  global.matchmakingInterval = setInterval(async () => {
    try {
      await matchmakingService.findMatch();
    } catch (err) {
      console.error("Error in matchmaking interval:", err);
    }
  }, MATCHMAKING_INTERVAL);

  console.log("Matchmaking service started.");
}

async function startApp() {
  await connectToRedis(); // Ensure Redis is ready

  const dbManagerQueue = new DbManagerQueue();

  try {
    // Start both services
    await Promise.all([dbManagerQueue.processRequests(), startMatchmaking()]);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

// Add type declaration for the global matchmaking interval
declare global {
  var matchmakingInterval: NodeJS.Timeout | undefined;
}

startApp();

export { redisClient };
