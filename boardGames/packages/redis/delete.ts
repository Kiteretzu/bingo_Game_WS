import { client } from "@repo/db/client";
import {
  BingoGameTier,
  Leagues,
  RequestStatus,
  Win_method,
} from "@prisma/client";
import {
  BoxesValue,
  GoalType,
  PlayerGameboardData,
} from "../../../games/src/mechanics/bingo/messages";
import { redisClient } from "../index";
import { RedisClientType } from "redis";
import {
  QUEUE_NAME,
  REDIS_PAYLOAD_AddMove,
  REDIS_PAYLOAD_END_GAME,
  REDIS_PAYLOAD_NewGame,
  REDIS_PAYLOAD_TossUpdate,
} from "types";

interface GameRequest {
  type: "new-game" | "add-move" | "toss-update-game" | "end-game";
  payload: any;
}

export class BingoDbManager {
  private client: RedisClientType = redisClient;
  private queueName = QUEUE_NAME;

  async processRequests() {
    const MAX_RETRIES = 5;
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
      try {
        const response = await this.client.brPop(this.queueName, 0);
        if (response?.key === this.queueName) {
          const requestData = this.safeParseJSON<GameRequest>(response.element);
          if (!requestData) continue;
          await this.handleRequest(requestData);
          retryCount = 0;
        }
      } catch (error: any) {
        console.error("Error processing request:", error.message);
        retryCount++;
        await this.delay(1000 * retryCount);
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
      await client.$transaction(async (tx) => {
        // 1. Update game record
        const updatedGame = await tx.bingoGame.update({
          where: { gameId: payload.gameId },
          data: {
            gameWinner: { connect: { id: payload.winner.id } },
            gameLoser: { connect: { id: payload.loser.id } },
            winMethod: payload.gameEndMethod,
            winMMR: payload.winner.winnerMMR.totalWinningPoints,
            loserMMR: payload.loser.loserMMR.totalLosingPoints,
            gameEndedAt: new Date(),
          },
        });

        // 2. Create game history entries
        await tx.bingoGameHistory.createMany({
          data: [
            { bingoProfileId: payload.winner.id, gameId: payload.gameId },
            { bingoProfileId: payload.loser.id, gameId: payload.gameId },
          ],
        });

        // 3. Update winner stats
        await tx.bingoProfile.update({
          where: { id: payload.winner.id },
          data: {
            mmr: { increment: payload.winner.winnerMMR.totalWinningPoints },
            firstBlood_count: {
              increment: this.countGoals(
                payload.winner.winnerGoal,
                GoalType.FIRST_BLOOD
              ),
            },
            doubleKill_count: {
              increment: this.countGoals(
                payload.winner.winnerGoal,
                GoalType.DOUBLE_KILL
              ),
            },
            tripleKill_count: {
              increment: this.countGoals(
                payload.winner.winnerGoal,
                GoalType.TRIPLE_KILL
              ),
            },
            rampage_count: {
              increment: this.countGoals(
                payload.winner.winnerGoal,
                GoalType.RAMPAGE
              ),
            },
            perfectionist_count: {
              increment: this.countGoals(
                payload.winner.winnerGoal,
                GoalType.PERFECTIONIST
              ),
            },
            lines_count: { increment: payload.winner.lineCount },
            totalMatches: { increment: 1 },
            wins: { increment: 1 },
          },
        });

        // 4. Update loser stats
        await tx.bingoProfile.update({
          where: { id: payload.loser.id },
          data: {
            mmr: {
              decrement: Math.abs(payload.loser.loserMMR.totalLosingPoints),
            },
            firstBlood_count: {
              increment: this.countGoals(
                payload.loser.loserGoal,
                GoalType.FIRST_BLOOD
              ),
            },
            doubleKill_count: {
              increment: this.countGoals(
                payload.loser.loserGoal,
                GoalType.DOUBLE_KILL
              ),
            },
            tripleKill_count: {
              increment: this.countGoals(
                payload.loser.loserGoal,
                GoalType.TRIPLE_KILL
              ),
            },
            rampage_count: {
              increment: this.countGoals(
                payload.loser.loserGoal,
                GoalType.RAMPAGE
              ),
            },
            perfectionist_count: {
              increment: this.countGoals(
                payload.loser.loserGoal,
                GoalType.PERFECTIONIST
              ),
            },
            lines_count: { increment: payload.loser.lineCount },
            totalMatches: { increment: 1 },
            losses: { increment: 1 },
          },
        });

        // 5. Update player records
        await tx.bingoPlayerRecords.upsert({
          where: {
            player1Id_player2Id: {
              player1Id: payload.winner.id,
              player2Id: payload.loser.id,
            },
          },
          create: {
            player1Id: payload.winner.id,
            player2Id: payload.loser.id,
            player1Wins: 1,
            totalMatches: 1,
            lastPlayedAt: new Date(),
          },
          update: {
            player1Wins: { increment: 1 },
            totalMatches: { increment: 1 },
            lastPlayedAt: new Date(),
          },
        });
      });

      console.log(`Successfully ended game: ${payload.gameId}`);
    } catch (error) {
      console.error("Error handling end game:", error);
      throw error;
    }
  }

  private async handleNewGame(payload: REDIS_PAYLOAD_NewGame["payload"]) {
    try {
      await client.$transaction(async (tx) => {
        // Create game
        const game = await tx.bingoGame.create({
          data: {
            gameId: payload.gameId,
            players: {
              connect: payload.players.map((player) => ({
                id: player.user.bingoProfile.id,
              })),
            },
            tossWinner: {
              connect: { id: payload.tossWinner },
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

        // Create initial game history entries
        await tx.bingoGameHistory.createMany({
          data: payload.players.map((player) => ({
            bingoProfileId: player.user.bingoProfile.id,
            gameId: payload.gameId,
          })),
        });

        // Initialize player records if needed
        await tx.bingoPlayerRecords.upsert({
          where: {
            player1Id_player2Id: {
              player1Id: payload.players[0].user.bingoProfile.id,
              player2Id: payload.players[1].user.bingoProfile.id,
            },
          },
          create: {
            player1Id: payload.players[0].user.bingoProfile.id,
            player2Id: payload.players[1].user.bingoProfile.id,
            player1Wins: 0,
            player2Wins: 0,
            totalMatches: 0,
          },
          update: {},
        });
      });

      console.log(`Created new game: ${payload.gameId}`);
    } catch (error) {
      console.error("Error creating new game:", error);
      throw error;
    }
  }

  // ... rest of the class methods remain the same ...
}
