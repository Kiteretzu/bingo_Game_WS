import { client } from "@repo/db/client";
import {
  BoxesValue,
  PlayerData,
  PlayerGameboardData,
} from "@repo/games/bingo/messages";
import { createClient } from "redis";

// Create and connect the Redis client
const redisClient = createClient();

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis.");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    process.exit(1); // Exit if the connection fails
  }
})();

export type RequestType = "new-game" | "add-move" | "toss-update-game";

export interface GameRequest {
  type: RequestType;
  payload: any; // Define specific types for each request type in separate interfaces
}

export interface AddMovePayload {
  gameId: string;
  moveCount: number;
  value: BoxesValue;
  time: any; // Replace `any` with `string` or `Date` based on your implementation
}

export interface TossUpdatePayload {
  gameId: string;
  players: PlayerData[];
}

export interface NewGamePayload {
  gameId: string;
  players: PlayerData[];
  playerGameboardData: PlayerGameboardData[];
}

export interface UpdateGamePayload {
  gameId: string;
  updates: Partial<{
    players: PlayerData[];
    playerGameboardData: PlayerGameboardData[];
  }>;
}

export interface DeleteGamePayload {
  gameId: string;
}

// Class to handle Redis queue processing
class RedisQueueProcessor {
  private client = redisClient;
  private queueName = "game-requests";

  async processRequests() {
    console.log(`Starting to process requests from queue: ${this.queueName}`);
    while (true) {
      try {
        // Block until a new request is available in the queue
        const response = await this.client.brPop(this.queueName, 0);
        if (response?.key === this.queueName) {
          const requestData = safeParseJSON<GameRequest>(response.element);
          if (!requestData) {
            console.error("Invalid request data, skipping.");
            continue;
          }

          switch (requestData.type) {
            case "new-game":
              await this.handleNewGame(requestData.payload as NewGamePayload);
              break;
            case "add-move":
              await this.handleAddMove(requestData.payload as AddMovePayload);
              break;
            case "toss-update-game":
              await this.handleTossUpdate(
                requestData.payload as TossUpdatePayload
              );
              break;
            default:
              console.error(`Unknown request type: ${requestData.type}`);
          }
        }
      } catch (error: any) {
        console.error("Error processing request:", error.message);

        // Optional: Delay before retrying to avoid infinite rapid retries
        await delay(1000);
      }
    }
  }

  private async handleTossUpdate(payload: TossUpdatePayload) {
    console.log(
      "Handling 'toss-update-game' request for gameId:",
      payload.gameId
    );
    try {
      const updatedGame = await client.bingoGame.update({
        where: {
          gameId: payload.gameId,
        },
        data: {
          players: {
            connect: payload.players.map((player) => ({
              id: player.user.bingoProfile.id,
            })),
          },
        },
      });
      console.log("Toss updated successfully:", updatedGame);
    } catch (error) {
      console.error("Error updating toss:", error);
    }
  }

  private async handleAddMove(payload: AddMovePayload) {
    console.log("Handling 'add-move' request for gameId:", payload.gameId);

    try {
      const updatedGame = await client.bingoGame.update({
        where: { gameId: payload.gameId },
        data: {
          matchHistory: {
            push: {
              moveCount: payload.moveCount,
              value: payload.value,
              time: payload.time,
            },
          },
        },
      });

      console.log("Move added successfully:", updatedGame);
    } catch (error) {
      console.error("Error adding move:", error);
    }
  }

  private async handleNewGame(payload: NewGamePayload) {
    console.log("Handling 'new-game' request for gameId:", payload.gameId);
    try {
      const newGame = await client.bingoGame.create({
        data: {
          gameId: payload.gameId,
          players: {
            connect: payload.players.map((player) => ({
              id: player.user.bingoProfile.id,
            })),
          },
          matchHistory: [],
          gameboards: payload.playerGameboardData.map((data) => ({
            playerId: data.playerId,
            gameBoard: data.gameBoard,
          })),
        },
      });
      console.log("New game created successfully:", newGame);
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }
}

// Utility function to parse JSON safely
function safeParseJSON<T>(json: string | undefined): T | null {
  try {
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

// Utility function to introduce delay (in milliseconds)
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start processing requests
const processor = new RedisQueueProcessor();
processor.processRequests().catch((err) => {
  console.error("Unexpected error in processRequests:", err);
  process.exit(1); // Exit on unexpected errors to avoid zombie processes
});

// Gracefully handle process termination
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await redisClient.disconnect();
  process.exit(0);
});

// Export the Redis client for reuse in other modules
export { redisClient };
