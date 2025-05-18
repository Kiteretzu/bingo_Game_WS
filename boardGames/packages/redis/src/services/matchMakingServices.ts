import { RedisClientType } from "redis";
import { REDIS_PlayerFindingMatch } from "types";
import "../config";
import { getRedisClient } from "../config";

export class MatchmakingService {
  private static instance: MatchmakingService;
  private redisClient: RedisClientType | null = null;
  private queueName = "matchmakingQueue";
  private channelName = "matchmaking";
  private initialized = false;

  public static getInstance(): MatchmakingService {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService();
    }
    return MatchmakingService.instance;
  }

  private constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      console.log("Initializing MatchmakingService with Redis client");
      console.log(
        "Redis config:",
        process.env.REDIS_PORT,
        process.env.REDIS_HOST
      );
      this.redisClient = await getRedisClient();
      this.initialized = true;
      console.log("MatchmakingService initialized successfully");
    } catch (err) {
      console.error("Error initializing MatchmakingService:", err);
    }
  }

  private async ensureInitialized(): Promise<boolean> {
    if (!this.initialized) {
      try {
        await this.initialize();
        return this.initialized;
      } catch (err) {
        console.error("Failed to initialize MatchmakingService:", err);
        return false;
      }
    }
    return true;
  }

  async publishMatchCreated(
    player1: REDIS_PlayerFindingMatch,
    player2: REDIS_PlayerFindingMatch
  ) {
    if (!(await this.ensureInitialized())) return;

    try {
      const message = JSON.stringify({
        event: "matchCreated",
        players: [player1, player2],
        timestamp: Date.now(),
      });

      await this.redisClient!.publish(this.channelName, message);
      console.log(
        `Published matchCreated event for players ${player1.id} and ${player2.id}.`
      );
    } catch (error) {
      console.error("Error publishing matchCreated event:", error);
    }
  }

  async addPlayerToQueue(player: REDIS_PlayerFindingMatch) {
    if (!(await this.ensureInitialized())) return;

    try {
      await this.redisClient!.lPush(this.queueName, JSON.stringify(player));
      console.log(`Player ${player.id} added to the matchmaking queue.`);
    } catch (error) {
      console.error("Error adding player to queue:", error);
    }
  }

  async removePlayerFromQueue(player: REDIS_PlayerFindingMatch) {
    if (!(await this.ensureInitialized())) return;

    try {
      console.log("point of failure", player);
      await this.redisClient!.lRem(this.queueName, 1, JSON.stringify(player));
      console.log(`Player ${player.id} removed from the matchmaking queue.`);
    } catch (error) {
      console.error("Error removing player from queue:", error);
    }
  }

  async findMatch() {
    if (!(await this.ensureInitialized())) return;

    const MAX_RETRIES = 5;
    const MAX_DELAY = 10000; // 10 seconds
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
      try {
        // Fetch all players from the queue
        const players = await this.redisClient!.lRange(this.queueName, 0, -1);
        if (players.length < 2) {
          console.log("Not enough players in the queue to find a match.");
          return;
        }

        // Parse players once
        const parsedPlayers: REDIS_PlayerFindingMatch[] = players.map(
          (player) => JSON.parse(player)
        );

        // Group players by matchTier
        const playersByTier: Record<string, REDIS_PlayerFindingMatch[]> = {};
        for (const player of parsedPlayers) {
          const tier = player.matchTier || "default";
          if (!playersByTier[tier]) {
            playersByTier[tier] = [];
          }
          playersByTier[tier].push(player);
        }

        // Find matches within each tier
        for (const tier in playersByTier) {
          const tierPlayers = playersByTier[tier];
          if (tierPlayers.length < 2) {
            console.log(`Not enough players in tier ${tier} to find a match.`);
            continue;
          }

          // Sort players by MMR
          tierPlayers.sort((a, b) => a.mmr - b.mmr);

          let bestMatch:
            | [REDIS_PlayerFindingMatch, REDIS_PlayerFindingMatch]
            | null = null;
          let smallestMMRDifference = Infinity;

          // Find the best match using a sliding window
          for (let i = 0; i < tierPlayers.length - 1; i++) {
            const player1 = tierPlayers[i];
            const player2 = tierPlayers[i + 1];

            // Prevent matching the same player
            if (player1.id === player2.id) continue;

            const mmrDifference = Math.abs(player1.mmr - player2.mmr);

            if (mmrDifference < smallestMMRDifference) {
              smallestMMRDifference = mmrDifference;
              bestMatch = [player1, player2];
            }
          }

          if (bestMatch) {
            const [player1, player2] = bestMatch;

            // Remove matched players in a single Redis transaction
            const multi = this.redisClient!.multi();
            multi.lRem(this.queueName, 1, JSON.stringify(player1));
            multi.lRem(this.queueName, 1, JSON.stringify(player2));
            await multi.exec();

            console.log(
              `Matched players in tier ${tier}: ${player1.id} (MMR: ${player2.mmr}) and ${player2.id} (MMR: ${player2.mmr})`
            );

            // Notify GameManager
            await this.publishMatchCreated(player1, player2);
          } else {
            console.log(`No suitable match found in tier ${tier}.`);
          }
        }

        // Reset retry count on success
        retryCount = 0;
      } catch (error: any) {
        console.error("Error finding match:", error.message);
        retryCount++;

        // Exponential backoff with a maximum delay
        const delayMs = Math.min(1000 * retryCount, MAX_DELAY);
        await this.delay(delayMs);
      }
    }

    console.error("Max retries reached. Stopping matchmaking.");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const matchmakingService = MatchmakingService.getInstance();
