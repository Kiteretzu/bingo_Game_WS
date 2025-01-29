import { PlayerData } from "../../../games/src/mechanics/bingo/messages";
import { client } from "@repo/db/client";
import { redisClient } from "../index";
import { createClient, RedisClientType } from "redis";
import { Game } from "../../../games/src/games/bingo/game";

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


async test(obj: Game) {
    // Serialize the Game object
    const gameData = {
        gameId: obj.gameId,
        tossWinner: obj.tossWinner,
        playerData: obj.playerData,
        playerGameboardData: obj.playerGameboardData,
        moveCount: obj.moveCount,
        matchHistory: obj.matchHistory,
        playerBoards: obj.playerBoards.map(board => board.getGameBoard()), // Serialize boards
    };

    console.log('Storing game data in Redis...');

    // Store the serialized game data in Redis
    await this.redis.set(`game:${obj.gameId}`, JSON.stringify(gameData));

    // console.log('Game data stored successfully.');

    // Deserialize example (retrieve and parse data from Redis)
    const storedData = await this.redis.get(`game:${obj.gameId}`);
    if (storedData) {
        const deserializedGameData = JSON.parse(storedData);
        // console.log('Deserialized game data:', deserializedGameData);
    } else {
        console.log('No data found in Redis for the given game ID.');
    }
}

  async addGame(gameId: string) {
    try {
      const response = await this.redis.sAdd(this.GAME_SET, gameId);

      console.log("Game added to set:", response);
    } catch (error) {
      console.error("Error in addGame:", error);
      throw error;
    }
  }

  async addUserToGame(userId: string, playerData: PlayerData) { 
    try {
      await this.redis.hSet(`${this.USER_SET}:${userId}`, playerData.user.googleId, JSON.stringify(playerData));
    } catch (error) {
      console.error("Error in addUserToGame:", error);
      throw error;
    }
  }

  async getAllUsersToGames() {
    const keys = await this.redis.keys(`${this.USER_SET}*`);
    const users = [];
    for (const key of keys) {
      const user = await this.redis.hGetAll(key);
      users.push(user);
    }
    return users;
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
    try {
      console.log('IN HERER!!!',)
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

        console.log('REDIS game', game)

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
      // Ensure Redis is connected
      if (!this.redis.isOpen) {
        await this.redis.connect();
      }

      const response = await this.redis.sRem(this.GAME_SET, gameId);
      console.log("Game removed from set:", response);
    } catch (error) {
      console.error("Error in removeGame:", error);
      throw error;
    }
  }
}

export const gameServices = GameServices.getInstance();