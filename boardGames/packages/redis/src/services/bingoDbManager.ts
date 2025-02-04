import { client } from "@repo/db/client";
import {
  BoxesValue,
  GoalType,
  PlayerData,
  PlayerGameboardData,
} from "../../../games/src/mechanics/bingo/messages";
import { redisClient } from "../index";
import { RedisClientType } from "redis";
import {
  QUEUE_NAME,
  REDIS_PAYLOAD_AddMove,
  REDIS_PAYLOAD_END_GAME,
  REDIS_PAYLOAD_NewGame,
  REDIS_PAYLOAD_SentFriendRequest,
  REDIS_PAYLOAD_TossUpdate,
} from "types";

interface GameRequest {
  type:
    | "new-game"
    | "add-move"
    | "toss-update-game"
    | "end-game"
    | "friend-requests";
  payload: any;
}

export class BingoDbManager {
  private client: RedisClientType = redisClient;
  private queueName = QUEUE_NAME;

  async processRequests() {
    console.log(`Starting to process requests from queue: ${this.queueName}`);
    const MAX_RETRIES = 5;
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
      try {
        const response = await this.client.brPop(this.queueName, 0);
        if (response?.key === this.queueName) {
          const requestData = this.safeParseJSON<GameRequest>(response.element);
          if (!requestData) continue;

          await this.handleRequest(requestData);

          // Reset retry count on successful processing
          retryCount = 0;
        }
      } catch (error: any) {
        console.error("Error processing request:", error.message);
        retryCount++;
        await this.delay(1000 * retryCount); // Exponential backoff
      }
    }

    console.error("Max retries reached. Stopping request processing.");
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
      case "friend-requests":
        await this.handleFriendRequests(requestData.payload);
    }
  }

  private async updatePlayerStats(
    playerId: string,
    playerData: any,
    isWinner: boolean,
    gameId: string
  ) {
    const goals = playerData[isWinner ? "winnerGoal" : "loserGoal"];
    const mmrChange = isWinner
      ? playerData.winnerMMR.totalWinningPoints
      : playerData.loserMMR.totalLosingPoints;

    try {
      await client.bingoProfile.update({
        where: { id: playerId },
        data: {
          mmr: { [isWinner ? "increment" : "decrement"]: mmrChange },
          firstBlood_count: {
            increment: this.countGoals(goals, GoalType.FIRST_BLOOD),
          },
          doubleKill_count: {
            increment: this.countGoals(goals, GoalType.DOUBLE_KILL),
          },
          tripleKill_count: {
            increment: this.countGoals(goals, GoalType.TRIPLE_KILL),
          },
          rampage_count: {
            increment: this.countGoals(goals, GoalType.RAMPAGE),
          },
          perfectionist_count: {
            increment: this.countGoals(goals, GoalType.PERFECTIONIST),
          },
          lines_count: { increment: playerData.lineCount },
          totalMatches: { increment: 1 },
          [isWinner ? "wins" : "losses"]: { increment: 1 },
          gameHistory: { connect: { gameId } },
        },
      });

      console.log(`Updated stats for player with ID: ${playerId}`);
    } catch (error) {
      console.error("Error updating player stats:", error);
    }
  }

  private countGoals(goals: any[], goalType: GoalType) {
    return goals.filter((e) => e.goalName.includes(goalType) && e.isCompleted)
      .length;
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
          gameWinner: {
            connect: { id: payload.winner.id },
          },
          gameLoser: {
            connect: { id: payload.loser.id },
          },
          winMethod: payload.gameEndMethod,
          winMMR: payload.winner.winnerMMR.totalWinningPoints,
          loserMMR: payload.loser.loserMMR.totalLosingPoints,
          gameEndedAt: new Date(),
        },
      });

      await this.updatePlayerStats(
        payload.winner.id,
        payload.winner,
        true,
        payload.gameId
      );
      await this.updatePlayerStats(
        payload.loser.id,
        payload.loser,
        false,
        payload.gameId
      );

      // updating the record
      const record = await client.bingoPlayerRecords.findUnique({
        where: {
          player1Id_player2Id: {
            player1Id: payload.winner.id,
            player2Id: payload.loser.id,
          },
        },
      });

      if (record) {
        await client.bingoPlayerRecords.update({
          where: {
            player1Id_player2Id: {
              player1Id: payload.winner.id,
              player2Id: payload.loser.id,
            },
          },
          data: {
            player1Wins: record.player1Wins + 1,
            totalMatches: record.totalMatches + 1,
          },
        });
      }

      console.log(`Ended game with ID: ${payload.gameId}`);
    } catch (error) {
      console.error("Error handling end game:", error);
    }
  }

  private async handleTossUpdate(payload: REDIS_PAYLOAD_TossUpdate["payload"]) {
    try {
      await client.bingoGame.update({
        where: { gameId: payload.gameId },
        data: {
          players: {
            connect: payload.players.map((player) => ({
              id: player.user.bingoProfile.id,
            })),
          },
        },
      });

      console.log(`Updated toss for game with ID: ${payload.gameId}`);
    } catch (error) {
      console.error("Error updating toss:", error);
    }
  }

  private async handleAddMove(payload: REDIS_PAYLOAD_AddMove["payload"]) {
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

      console.log(`Added move to game with ID: ${payload.gameId}`);
    } catch (error) {
      console.error("Error adding move:", error);
    }
  }

  private async handleNewGame(payload: REDIS_PAYLOAD_NewGame["payload"]) {
    try {
      await client.bingoGame.create({
        data: {
          gameId: payload.gameId,
          players: {
            connect: payload.players.map((player) => ({
              id: player.user.bingoProfile.id,
            })),
          },
          tossWinner: {
            connect: {
              id: payload.tossWinner,
            },
          },
          matchHistory: [],
          gameboards: [
            {
              playerId: payload.players[0].user.bingoProfile.id,
              gameBoard: payload.playerGameboardData[0].gameBoard,
            },
            {
              playerId: payload.players[1].user.bingoProfile.id,
              gameBoard: payload.playerGameboardData[1].gameBoard,
            },
          ],
        },
      });

      // check if record exists

      const record = await client.bingoPlayerRecords.findUnique({
        where: {
          player1Id_player2Id: {
            player1Id: payload.players[0].user.bingoProfile.id,
            player2Id: payload.players[1].user.bingoProfile.id,
          },
        },
      });

      if (!record) {
        const newRecord = await client.bingoPlayerRecords.create({
          data: {
            player1Id: payload.players[0].user.bingoProfile.id,
            player2Id: payload.players[1].user.bingoProfile.id,
            player1Wins: 0,
            player2Wins: 0,
          },
        });

        console.log("new bingoPlayer record formed successfully", newRecord);
      }

      console.log(`Created new game with ID: ${payload.gameId}`);
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }

  private async handleFriendRequests(
    payload: REDIS_PAYLOAD_SentFriendRequest["payload"]
  ) {
    try {
      const data = await client.friendRequest.create({
        data: {
          sender: {
            connect: {
              googleId: payload.from,
            },
          },
          receiver: {
            connect: {
              googleId: payload.to,
            },
          },
        },
      });

      console.log("Created friend request:", data);
    } catch (error) {
      console.error("Error creating friend request:", error);
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
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
