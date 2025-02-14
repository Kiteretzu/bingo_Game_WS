import { PlayerData } from "@repo/messages/message";
import { client } from "@repo/db/client";
import { redisClient } from "../index";
import { createClient, RedisClientType } from "redis";

class GameServices {
  private static instance: GameServices;
  private redis: RedisClientType;
  private readonly GAME_SET = "activeGames";
  private readonly USER_SET = "activeUsers";

  constructor() {
    this.redis = createClient();
    this.initialize(); // Initialize the Redis connection
  }

  private async initialize(): Promise<void> {
    try {
      await this.redis.connect();
      console.log("Connected to Redis");
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
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
   * Add a gameId to the active games set.
   */



  async addGame(gameId: string) {
    try {
      const response = await this.redis.sAdd(this.GAME_SET, gameId);

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
      // Store simple userId -> gameId mapping
      await this.redis.set(`${this.USER_SET}:${userId}`, gameId);

      // If you need to verify the mapping
      const test = await this.redis.get(`${this.USER_SET}:${userId}`);
      // console.log("test", test);
    } catch (error) {
      console.error("Error in addUserToGame:", error);
      throw error;
    }
  }

  async getAllUsersToGames() {
    try {
      // Get all keys matching the pattern
      console.log('working inside GETALL USER TO GAMES',)
      const keys = await this.redis.keys(`${this.USER_SET}:*`);

      // Multi is used instead of pipeline for redis package
      const multi = this.redis.multi();
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
      // Ensure Redis is connected
      if (!this.redis.isOpen) {
        await this.redis.connect();
      }

      const isActive = await this.redis.sIsMember(this.GAME_SET, gameId);
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
      console.error("Error in getGame:", error);
      throw error;
    }
  }

  /**
   * Get all active game IDs from the set and their states from the database.
   */
  async getAllGames() {
    console.log('whats GOING ON!!!!',)
    try {
      console.log("IN HERER!!!");
      // Ensure Redis is connected
      if (!this.redis.isOpen) {
        await this.redis.connect();
      }

      const gameIds = await this.redis.sMembers(this.GAME_SET);
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
      const response = await this.redis.sRem(this.GAME_SET, gameId);

      if (response === 0) {
        console.log("Game not found in set");
      } else {
        console.log("Game removed from set:", response);
      }
    } catch (error) {
      console.error("Error in removeGame:", error);
      throw error;
    }
  }

  async removeUserFromGame(userId: string) {
    try {
      const response = await this.redis.del(`${this.USER_SET}:${userId}`);

      if (response === 0) {
        console.log("User not found in set");
      } else {
        console.log("User removed from set:", response);
      }
    } catch (error) {
      console.error("Error in removeUserFromGame:", error);
      throw error;
    }
  }

}

export const gameServices = GameServices.getInstance();
