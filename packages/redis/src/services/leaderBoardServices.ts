import { client, PrismaClient } from "@repo/db/client";
import { LeaderboardEntry } from "@repo/graphql/types/server";
import { RedisClientType } from "redis";
import { getRedisClient } from "../config/redisClient";

class LeaderboardService {
  private static instance: LeaderboardService;
  private redis: RedisClientType | null = null;
  private prisma: PrismaClient;
  private readonly leaderboardKey: string = "game:bingo:leaderboard";
  private readonly cacheTimeKey: string = "game:bingo:leaderboard:lastUpdate";
  private readonly cacheDuration: number = 30 * 60; // 30 minutes in seconds

  constructor() {
    this.prisma = client;
    this.initialize();
  }

  // initialze redis connect
  private async initialize(): Promise<void> {
    try {
      this.redis = await getRedisClient();
      console.log("Connected to Redis in leaderBoardServices.");
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
      // Allow the application to continue running
    }
  }

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  /**
   * Ensures Redis connection is open before performing operations
   */

  private async ensureConnection(): Promise<RedisClientType> {
    if (!this.redis) {
      this.redis = await getRedisClient();
    }

    if (!this.redis.isOpen) {
      this.redis = await getRedisClient(); // Get a fresh connection from the singleton
    }

    return this.redis;
  }
  //    * Check if cache needs refresh.

  private async shouldRefreshCache(): Promise<boolean> {
    // console.log("Redis ready state:", this.redis.isReady());
    // console.log("Redis status:", this.redis.status);
    const redis = await this.ensureConnection();
    console.log("dagger1");
    const lastUpdate = await redis.get(this.cacheTimeKey);
    console.log("dagger2");
    if (!lastUpdate) return true;

    const timeSinceUpdate =
      Math.floor(Date.now() / 1000) - parseInt(lastUpdate, 10);
    return timeSinceUpdate > this.cacheDuration;
  }

  //    * Refresh leaderboard data from the database.

  private async refreshLeaderboardCache(): Promise<void> {
    try {
      // check if redisClient alive
      const redis = await this.ensureConnection();

      const users = await this.prisma.bingoProfile.findMany({
        where: {
          mmr: {
            not: undefined,
          },
        },
        orderBy: {
          mmr: "desc",
        },
        include: {
          User: true,
        },
      });

      console.log("kammer2");
      const multi = redis.multi();

      // Clear existing leaderboard and add updated data.
      multi.del(this.leaderboardKey);
      users.forEach((user) => {
        if (user.mmr !== null) {
          multi?.zAdd(this.leaderboardKey, {
            score: user.mmr,
            value: JSON.stringify({
              id: user.User.googleId,
              displayName: user.User.displayName,
              mmr: user.mmr,
            }),
          });
        }
      });

      // Update the last refresh timestamp.
      const currentTime = Math.floor(Date.now() / 1000);
      multi.set(this.cacheTimeKey, currentTime.toString());

      await multi.exec(); // executes all the command written above as together
    } catch (err) {
      console.error("Failed to refresh leaderboard cache:", err);
    }
  }

  //    * Get leaderboard data, refreshing cache if needed.

  async getLeaderboard(limit = 10): Promise<Array<LeaderboardEntry>> {
    try {
      console.log("checker1");
      if (await this.shouldRefreshCache()) {
        await this.refreshLeaderboardCache();
      }
      console.log("checker2");
      const redis = await this.ensureConnection();

      const topPlayers = await redis.zRangeWithScores(
        this.leaderboardKey,
        0, // Start from the first element
        limit - 1, // End at the (limit - 1)th element
        { REV: true } // Retrieve in descending order
      );

      return topPlayers?.map((player, index) => {
        const userData = JSON.parse(player.value);
        return {
          ...userData,
          rank: index + 1,
        };
      })!;
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      return [];
    }
  }
}

export const leaderboardService = LeaderboardService.getInstance();
