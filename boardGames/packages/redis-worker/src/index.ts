import { client } from "@repo/db/client";
import { BoxesValue, GoalType, PlayerData, PlayerGameboardData } from "@repo/games/bingo/messages";
import { createClient } from "redis";
import { REDIS_PAYLOAD_END_GAME } from "types";

const redisClient = createClient();

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis.");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  }
})();

interface GameRequest {
  type: "new-game" | "add-move" | "toss-update-game" | "end-game";
  payload: any;
}

interface AddMovePayload {
  gameId: string;
  moveCount: number;
  value: BoxesValue;
  by: string;
  time: string;
}

interface TossUpdatePayload {
  gameId: string;
  players: PlayerData[];
}

interface NewGamePayload {
  gameId: string;
  players: PlayerData[];
  playerGameboardData: PlayerGameboardData[];
}

class BingoStateManager {
  private client = redisClient;
  private queueName = "game-requests";

  async processRequests() {
    console.log(`Starting to process requests from queue: ${this.queueName}`);
    while (true) {
      try {
        const response = await this.client.brPop(this.queueName, 0);
        if (response?.key === this.queueName) {
          const requestData = this.safeParseJSON<GameRequest>(response.element);
          if (!requestData) continue;

          await this.handleRequest(requestData);
        }
      } catch (error: any) {
        console.error("Error processing request:", error.message);
        await this.delay(1000);
      }
    }
  }

  private async handleRequest(requestData: GameRequest) {
    switch (requestData.type) {
      case "new-game":
        await this.handleNewGame(requestData.payload);
        break;
      case "add-move":
        await this.handleAddMove(requestData.payload);
        break;
      case "toss-update-game":
        await this.handleTossUpdate(requestData.payload);
        break;
      case "end-game":
        await this.handleEndGame(requestData.payload);
        break;
    }
  }

  private async handleEndGame(payload: REDIS_PAYLOAD_END_GAME["payload"]) {
    try {
      const game = await client.bingoGame.findUnique({
        where: { gameId: payload.gameId },
      });

      if (!game) return;

      await client.bingoGame.update({
        where: { gameId: payload.gameId },
        data: {
          gameWinnerId: { set: payload.winner.id },
          winMethod: payload.winMethod,
        },
      });

      await this.updatePlayerStats(payload.winner.id, payload.winner, true, payload.gameId);
      await this.updatePlayerStats(payload.loser.id, payload.loser, false, payload.gameId);
    } catch (error) {
      console.error("Error handling end game:", error);
    }
  }

  private async updatePlayerStats(
    playerId: string, 
    playerData: any, 
    isWinner: boolean,
    gameId: string
  ) {
    const goals = playerData[isWinner ? 'winnerGoal' : 'loserGoal'];
    const mmrChange = isWinner ? 
      playerData.winnerMMR.totalWinningPoints : 
      playerData.loserMMR.totalLosingPoints;

    await client.bingoProfile.update({
      where: { id: playerId },
      data: {
        mmr: { [isWinner ? 'increment' : 'decrement']: mmrChange },
        firstBlood_count: { increment: this.countGoals(goals, GoalType.FIRST_BLOOD) },
        doubleKill_count: { increment: this.countGoals(goals, GoalType.DOUBLE_KILL) },
        tripleKill_count: { increment: this.countGoals(goals, GoalType.TRIPLE_KILL) },
        rampage_count: { increment: this.countGoals(goals, GoalType.RAMPAGE) },
        perfectionist_count: { increment: this.countGoals(goals, GoalType.PERFECTIONIST) },
        lines_count: { increment: playerData.lineCount },
        totalMatches: { increment: 1 },
        [isWinner ? 'wins' : 'losses']: { increment: 1 },
        gameHistory: { connect: { gameId } }
      },
    });
  }

  private countGoals(goals: any[], goalType: GoalType) {
    return goals.filter(e => e.goalName.includes(goalType) && e.isCompleted).length;
  }

  private async handleTossUpdate(payload: TossUpdatePayload) {
    try {
      await client.bingoGame.update({
        where: { gameId: payload.gameId },
        data: {
          players: {
            connect: payload.players.map(player => ({
              id: player.user.bingoProfile.id,
            })),
          },
        },
      });
    } catch (error) {
      console.error("Error updating toss:", error);
    }
  }

  private async handleAddMove(payload: AddMovePayload) {
    try {
      await client.bingoGame.update({
        where: { gameId: payload.gameId },
        data: {
          matchHistory: {
            push: {
              moveCount: payload.moveCount,
              value: payload.value,
              time: payload.time,
              bingoProfileId: payload.by,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error adding move:", error);
    }
  }

  private async handleNewGame(payload: NewGamePayload) {
    try {
      await client.bingoGame.create({
        data: {
          gameId: payload.gameId,
          players: {
            connect: payload.players.map(player => ({
              id: player.user.bingoProfile.id,
            })),
          },
          matchHistory: [],
          gameboards: payload.playerGameboardData.map(data => ({
            playerId: data.playerId,
            gameBoard: data.gameBoard,
          })),
        },
      });
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }

  private safeParseJSON<T>(json: string | undefined): T | null {
    try {
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

process.on("SIGINT", async () => {
  await redisClient.disconnect();
  process.exit(0);
});

const processor = new BingoStateManager();
processor.processRequests().catch(err => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

export { redisClient };