import { PlayerData } from "@repo/messages/message";
import { BingoGame, client } from "@repo/db/client";
import { getRedisClient } from "../index";
import { RedisClientType } from "redis";

class GameServices {
  private static instance: GameServices;
  private redis: RedisClientType | null = null;
  private readonly GAME_SET = "activeGames";
  private readonly USER_SET = "activeUsers";

  constructor() {
    this.initialize(); // Initialize the Redis connection
  }

  private async initialize(): Promise<void> {
    try {
      this.redis = await getRedisClient();
      console.log("Connected to Redis in GameServices");
    } catch (err) {
      console.error("Failed to connect to Redis in GameServices:", err);
      process.exit(1); // Exit if the connection fails
    }
  }

  public static getInstance() {
    if (!GameServices.instance) {
      GameServices.instance = new GameServices();
    }
    return GameServices.instance;
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

  /**
   * Add a gameId to the active games set.
   */
  async addGame(gameId: string) {
    try {
      const redis = await this.ensureConnection();
      const response = await redis.sAdd(this.GAME_SET, gameId);

      if (response === 0) {
        console.log("Game already exists in set");
      } else {
        console.log("Game added to set:", response);
      }
    } catch (error) {
      console.error("Error in addGame:", error);
      throw error;
    }
  }

  async addUserToGame(userId: string, gameId: string) {
    try {
      const redis = await this.ensureConnection();
      // Store simple userId -> gameId mapping
      await redis.set(`${this.USER_SET}:${userId}`, gameId);

      // If you need to verify the mapping
      const test = await redis.get(`${this.USER_SET}:${userId}`);
      // console.log("test", test);
    } catch (error) {
      console.error("Error in addUserToGame:", error);
      throw error;
    }
  }

  async getAllUsersToGames() {
    try {
      const redis = await this.ensureConnection();
      // Get all keys matching the pattern
      console.log("working inside GETALL USER TO GAMES");
      const keys = await redis.keys(`${this.USER_SET}:*`);

      // Multi is used instead of pipeline for redis package
      const multi = redis.multi();
      keys.forEach((key) => multi.get(key));

      // Execute and get results
      const results = await multi.exec();

      // Map results to user-game pairs
      const userGameMappings = keys.map((key, index) => ({
        userId: key.split(":")[1],
        gameId: results[index], // results are direct values with redis package
      }));

      return userGameMappings;
    } catch (error) {
      console.error("Error in getAllUsersToGames:", error);
      throw error;
    }
  }

  /**
   * Get a specific game's state from the database by gameId.
   */
  async getGame(gameId: string) {
    try {
      const redis = await this.ensureConnection();
      const isActive = await redis.sIsMember(this.GAME_SET, gameId);
      if (!isActive) {
        return null; // Game not found in active games
      }

      const game = await client.bingoGame.findUnique({
        where: { gameId },
        include: {
          players: {
            include: {
              User: true,
            },
          },
        },
      });

      return game;
    } catch (error) {
      console.error("Error in getGame for gameId:", gameId, error);
      throw error;
    }
  }

  /**
   * Get all active game IDs from the set and their states from the database.
   */
  async getAllGames() {
    console.log("whats GOING ON!!!!");
    try {
      console.log("IN HERER!!!");
      const redis = await this.ensureConnection();
      const gameIds = await redis.sMembers(this.GAME_SET);
      const games = [];

      for (const gameId of gameIds) {
        const game = await client.bingoGame.findUnique({
          where: { gameId },
          include: {
            players: {
              include: {
                User: true,
              },
            },
          },
        });

        console.log("this is the gameStarted in redis", game?.isGameStarted); // dont know why ts issue

        if (game) games.push(game);
      }

      return games;
    } catch (error) {
      console.error("Error in getAllGames:", error);
      throw error;
    }
  }

  /**
   * Remove a gameId from the active games set.
   */
  async removeGame(gameId: string) {
    try {
      const redis = await this.ensureConnection();
      const response = await redis.sRem(this.GAME_SET, gameId);

      if (response === 0) {
        console.log("Game not found in set");
      } else {
        console.log("Game removed from set:", response);
      }
    } catch (error) {
      console.error("Error in removeGame for gameId:", gameId, error);
      throw error;
    }
  }

  async removeUserFromGame(userId: string) {
    try {
      const redis = await this.ensureConnection();
      const response = await redis.del(`${this.USER_SET}:${userId}`);

      if (response === 0) {
        console.log("User not found in set");
      } else {
        console.log("User removed from set:", response);
      }
    } catch (error) {
      console.error("Error in removeUserFromGame for userId:", userId, error);
      throw error;
    }
  }
}

export const gameServices = GameServices;
