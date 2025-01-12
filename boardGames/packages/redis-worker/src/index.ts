import { client } from "@repo/db/client";
import { gameBoard } from "@repo/games/bingo/gameBoard";
import { newGameObj } from "helper";
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

const gameBoards = [
  {
    board: "board1",
    cells: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  },
  {
    board: "board2",
    cells: [
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1],
    ],
  },
];

// Function to process requests from the Redis queue
async function processRequests() {
  while (true) {
    try {
      // Block until a new request is available in the "new-game" queue
      const response = await redisClient.brPop("new-game", 0);
      if (response?.key === "new-game") {
        const requestData = safeParseJSON<newGameObj>(response?.element);
        if (!requestData) {
          console.error("Invalid request data, skipping.");
          continue;
        }

        console.log("Processing request for players:", requestData.players);

        const newGame = await client.bingoGame.create({
          data: {
            gameId: requestData.gameId,
            players: {
              connect: requestData.players.map((player) => ({
                id: player.user.bingoProfile.id,
              })),
            },
            matchHistory: [],
            gameboards: requestData.playerGameboardData.map((data) => ({
              playerId: data.playerId,
              gameBoard: data.gameBoard,
            })),
          },
        });

        console.log("New game created successfully:", newGame);
      }
    } catch (error: any) {
      console.error("Error processing request:", error.message);

      // Optional: Delay before retrying to avoid infinite rapid retries
      await delay(1000);
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
processRequests().catch((err) => {
  console.error("Unexpected error in processRequests:", err);
  process.exit(1); // Exit on unexpected errors to avoid zombie processes
});

// Export the Redis client for reuse in other modules
export { redisClient };