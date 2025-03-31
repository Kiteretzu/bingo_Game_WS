import { client } from "@repo/db/client";
import { DbManagerQueue } from "./services/dbManagerQueue";
import { MatchmakingService } from "./services/matchMakingServices";
import { getRedisClient } from "./config"; // Import the function from config
import { QUEUE_NAME } from "./types";


// Graceful shutdown handler
process.on("SIGINT", async () => {
  try {
    console.log("Shutting down services...");
    const redisInstance = await getRedisClient(); // Get the Redis client instance
    await redisInstance.disconnect(); // Disconnect properly
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
  console.log("before startApp", QUEUE_NAME);
  const redisClient = await getRedisClient(); // Ensure Redis is ready and get the client

  const dbManagerQueue = new DbManagerQueue();

  try {
    // Start both services
    await Promise.all([dbManagerQueue.processRequests(), startMatchmaking()]);
    console.log('working index REDIS',)
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

// Export the getRedisClient function rather than a client instance
export { getRedisClient };
