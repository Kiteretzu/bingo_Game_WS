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
import { SendFriendRequestDocument } from "@repo/graphql/types/client";
import { GraphQLError } from "graphql";
import { GraphQLClient } from "graphql-request"; // ignore this warning

interface GameRequest {
  type:
    | "new-game"
    | "add-move"
    | "toss-update-game"
    | "end-game"
    | "friend-requests";
  payload: any;
}

export class DbManagerQueue {
  private client: RedisClientType = redisClient;
  private queueName = QUEUE_NAME;
  private gqlClient: GraphQLClient;
  constructor() {
    console.log("this graphql endpoint", process.env.GRAPHQL_ENDPOINT);
    this.gqlClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);
  }

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
  private countGoals(goals: any[], goalType: GoalType) {
    if (!Array.isArray(goals)) {
      console.error("countGoals received an invalid goals value:", goals);
      return 0; // Return 0 if goals is not an array
    }

    return goals.filter((e) => e.goalName.includes(goalType) && e.isCompleted)
      .length;
  }

  private async handleEndGame(payload: REDIS_PAYLOAD_END_GAME["payload"]) {
    try {
      await client.$transaction(
        async (tx) => {
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

          const existingRecord = await tx.bingoPlayerRecords.findFirst({
            where: {
              OR: [
                { player1Id: payload.winner.id, player2Id: payload.loser.id },
                { player1Id: payload.loser.id, player2Id: payload.winner.id },
              ],
            },
          });
          if (existingRecord) {
            console.log("Updating bingPlayerRecords");
            await tx.bingoPlayerRecords.update({
              where: { id: existingRecord.id },
              data: {
                player1Wins:
                  payload.winner.id === existingRecord.player1Id
                    ? existingRecord.player1Wins + 1
                    : existingRecord.player1Wins,
                player2Wins:
                  payload.winner.id === existingRecord.player2Id
                    ? existingRecord.player2Wins + 1
                    : existingRecord.player2Wins,
                totalMatches: existingRecord.totalMatches + 1,
              },
            });
          }
        },
        { timeout: 20000 }
      );

      console.log(`Successfully ended game: ${payload.gameId}`);
    } catch (error) {
      console.error("Error handling end game:", error);
      throw error;
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

  private async handleNewGame(payload: REDIS_PAYLOAD_NewGame["payload"]) {
    try {
      console.log("this is THEP PROBLEM IN handleNewGame");

      await client.$transaction(
        async (tx) => {
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

          const existingRecord = await tx.bingoPlayerRecords.findFirst({
            where: {
              OR: [
                {
                  player1Id: payload.players[0].user.bingoProfile.id,
                  player2Id: payload.players[1].user.bingoProfile.id,
                },
                {
                  player1Id: payload.players[1].user.bingoProfile.id,
                  player2Id: payload.players[0].user.bingoProfile.id,
                },
              ],
            },
          });

          if (!existingRecord) {
            console.log("Creating new bingPlayerRecords");
            await tx.bingoPlayerRecords.create({
              data: {
                player1Id: payload.players[0].user.bingoProfile.id,
                player2Id: payload.players[1].user.bingoProfile.id,
                totalMatches: 0,
                player1Wins: 0,
                player2Wins: 0,
              },
            });
          }
        },
        { timeout: 10000 }
      );

      console.log(`Created new game: ${payload.gameId}`);
    } catch (error) {
      console.error("Error creating new game:", error);
      throw error;
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

  private async handleFriendRequests(
    payload: REDIS_PAYLOAD_SentFriendRequest["payload"]
  ) {
    console.log("inside redis FriendRequests", typeof payload.from, payload.to);
    try {
      const data = await this.gqlClient.request(
        SendFriendRequestDocument,
        payload
      );

      console.log("Created friend request:", data);
    } catch (error: any) {
      if (error instanceof GraphQLError) {
        console.error("GraphQL Error creating friend request:", error.message);
      } else {
        console.error("Error creating friend request:", error.message);
      }
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
