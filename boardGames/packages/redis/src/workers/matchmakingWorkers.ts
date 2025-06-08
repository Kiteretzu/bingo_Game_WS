

import { getRedisClient } from "../config/redisClient";
import { MatchmakingService } from "../services/matchMakingServices";

// Graceful shutdown handler
process.on("SIGINT", async () => {
  try {
    console.log("Shutting down matchmaking worker...");
    const redisInstance = await getRedisClient();
    await redisInstance.disconnect();
    console.log("Redis disconnected.");

    if (global.matchmakingInterval) {
      clearInterval(global.matchmakingInterval);
      console.log("Matchmaking interval stopped.");
    }
  } catch (err) {
    console.error("Error during matchmaking shutdown:", err);
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

  console.log("Matchmaking worker started.");
}

// Add type declaration for the global matchmaking interval
declare global {
  var matchmakingInterval: NodeJS.Timeout | undefined;
}

startMatchmaking();