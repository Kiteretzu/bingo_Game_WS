

import { client } from "@repo/db/client";
import { GraphQLClient } from "graphql-request";
import { SendFriendRequestDocument } from "@repo/graphql/types/client";
import { GoalType, MatchHistory } from "@repo/messages/message";
import {
  REDIS_PAYLOAD_NewGame,
  REDIS_PAYLOAD_AddMove,
  REDIS_PAYLOAD_TossUpdate,
  REDIS_PAYLOAD_END_GAME,
  REDIS_PAYLOAD_SentFriendRequest,
} from "../types";

// Single GraphQL client instance for friend request operations
const gqlClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

/**
 * Count completed goals of a given type.
 */
function countGoals(goals: any[], goalType: GoalType): number {
  if (!Array.isArray(goals)) return 0;
  return goals.filter((e) => e.goalName.includes(goalType) && e.isCompleted).length;
}

/**
 * Handler for "new-game" events.
 */
export async function handleNewGame(
  payload: REDIS_PAYLOAD_NewGame["payload"]
): Promise<void> {
  try {
    await client.$transaction(
      async (tx) => {
        // Create new game
        await tx.bingoGame.create({
          data: {
            gameId: payload.gameId,
            players: {
              connect: payload.players.map((p) => ({
                id: p.user.bingoProfile.id,
              })),
            },
            tossWinner: { connect: { id: payload.tossWinner } },
            matchHistory: [],
            gameboards: payload.playerGameboardData.map((p) => ({
              gameBoard: p.gameBoard,
            })),
          },
        });

        // Create history entries
        await tx.bingoGameHistory.createMany({
          data: payload.players.map((p) => ({
            bingoProfileId: p.user.bingoProfile.id,
            gameId: payload.gameId,
          })),
        });

        // Initialize player records if none exist
        const existing = await tx.bingoPlayerRecords.findFirst({
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
        if (!existing) {
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

/**
 * Handler for "add-move" events.
 */
export async function handleAddMove(
  payload: REDIS_PAYLOAD_AddMove["payload"]
): Promise<void> {
  try {
    await client.bingoGame.update({
      where: { gameId: payload.gameId },
      data: {
        matchHistory: {
          push: payload.data as MatchHistory[0],
        },
      },
    });
    console.log(`Added move to game with ID: ${payload.gameId}`);
  } catch (error) {
    console.error("Error adding move:", error);
  }
}

/**
 * Handler for "toss-update-game" events.
 */
export async function handleTossUpdate(
  payload: REDIS_PAYLOAD_TossUpdate["payload"]
): Promise<void> {
  try {
    await client.bingoGame.update({
      where: { gameId: payload.gameId },
      data: {
        isGameStarted: payload.gameStarted,
        players: {
          connect: payload.players.map((p) => ({
            id: p.user.bingoProfile.id,
          })),
        },
        gameboards: [
          {
            gameBoard: payload.playerGameBoardData[0].gameBoard,
          },
          {
            gameBoard: payload.playerGameBoardData[1].gameBoard,
          },
        ],
      },
    });
    console.log(`Updated toss for game with ID: ${payload.gameId}`);
  } catch (error) {
    console.error("Error updating toss:", error);
  }
}

/**
 * Handler for "end-game" events.
 */
export async function handleEndGame(
  payload: REDIS_PAYLOAD_END_GAME["payload"]
): Promise<void> {
  try {
    await client.$transaction(
      async (tx) => {
        // Update game result
        await tx.bingoGame.update({
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

        // Update winner profile stats
        await tx.bingoProfile.update({
          where: { id: payload.winner.id },
          data: {
            mmr: { increment: payload.winner.winnerMMR.totalWinningPoints },
            firstBlood_count: {
              increment: countGoals(
                payload.winner.winnerGoal,
                GoalType.FIRST_BLOOD
              ),
            },
            doubleKill_count: {
              increment: countGoals(
                payload.winner.winnerGoal,
                GoalType.DOUBLE_KILL
              ),
            },
            tripleKill_count: {
              increment: countGoals(
                payload.winner.winnerGoal,
                GoalType.TRIPLE_KILL
              ),
            },
            rampage_count: {
              increment: countGoals(
                payload.winner.winnerGoal,
                GoalType.RAMPAGE
              ),
            },
            perfectionist_count: {
              increment: countGoals(
                payload.winner.winnerGoal,
                GoalType.PERFECTIONIST
              ),
            },
            lines_count: { increment: payload.winner.lineCount },
            totalMatches: { increment: 1 },
            wins: { increment: 1 },
          },
        });

        // Update loser profile stats
        await tx.bingoProfile.update({
          where: { id: payload.loser.id },
          data: {
            mmr: {
              decrement: Math.abs(
                payload.loser.loserMMR.totalLosingPoints
              ),
            },
            firstBlood_count: {
              increment: countGoals(
                payload.loser.loserGoal,
                GoalType.FIRST_BLOOD
              ),
            },
            doubleKill_count: {
              increment: countGoals(
                payload.loser.loserGoal,
                GoalType.DOUBLE_KILL
              ),
            },
            tripleKill_count: {
              increment: countGoals(
                payload.loser.loserGoal,
                GoalType.TRIPLE_KILL
              ),
            },
            rampage_count: {
              increment: countGoals(
                payload.loser.loserGoal,
                GoalType.RAMPAGE
              ),
            },
            perfectionist_count: {
              increment: countGoals(
                payload.loser.loserGoal,
                GoalType.PERFECTIONIST
              ),
            },
            lines_count: { increment: payload.loser.lineCount },
            totalMatches: { increment: 1 },
            losses: { increment: 1 },
          },
        });

        // Update or create player records
        const existing = await tx.bingoPlayerRecords.findFirst({
          where: {
            OR: [
              { player1Id: payload.winner.id, player2Id: payload.loser.id },
              { player1Id: payload.loser.id, player2Id: payload.winner.id },
            ],
          },
        });
        if (existing) {
          await tx.bingoPlayerRecords.update({
            where: { id: existing.id },
            data: {
              player1Wins:
                payload.winner.id === existing.player1Id
                  ? existing.player1Wins + 1
                  : existing.player1Wins,
              player2Wins:
                payload.winner.id === existing.player2Id
                  ? existing.player2Wins + 1
                  : existing.player2Wins,
              totalMatches: existing.totalMatches + 1,
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

/**
 * Handler for "friend-requests" events.
 */
export async function handleFriendRequests(
  payload: REDIS_PAYLOAD_SentFriendRequest["payload"]
): Promise<void> {
  try {
    const data = await gqlClient.request(
      SendFriendRequestDocument,
      payload
    );
    console.log("Created friend request:", data);
  } catch (error: any) {
    console.error("Error creating friend request:", error);
    throw error;
  }
}