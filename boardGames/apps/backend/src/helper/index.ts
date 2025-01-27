import { BingoGame, BingoProfile } from "@repo/db/client";
import { PlayerData, PlayerGameboardData } from "@repo/games/bingo/messages";
import { GetServerPlayerProfileDocument } from "@repo/graphql/types/client";
import { gameServices } from "@repo/redis/services";
import jwt from "jsonwebtoken";
import { DECODED_TOKEN } from "types";
import { Game } from "ws/Game";
const { request } = require("graphql-request");

export async function getPlayerData(token: string): Promise<PlayerData | null> {
  try {
    // Decode the JWT token to extract googleId
    const googleId = (
      jwt.verify(token, process.env.JWT_SECRET!) as DECODED_TOKEN
    ).googleId;

    // Prepare the variables for the GraphQL query
    const variables = { googleId };

    // Fetch the player data from the server using the GraphQL request
    const playerData = await request(
      "http://localhost:8080/graphql",
      GetServerPlayerProfileDocument,
      variables
    );

    return playerData;
  } catch (error) {
    console.error("Error fetching player data:", error);
    return null; // or handle error accordingly
  }
}

// for verifying jwt Token and return back the decoded
export const verifyToken = (token: string): DECODED_TOKEN => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DECODED_TOKEN;
    return decoded; // Return decoded user information
  } catch (error: any) {
    throw error;
  }
};

export const formatToPlayersData = (
  game: BingoGame & BingoProfile
): PlayerData[] => {
  const player1 = game.players[0];
  const player2 = game.players[1];
  const playerData1: PlayerData = {
    user: {
      googleId: player1.User.googleId!,
      displayName: player1.User.displayName!,
      avatar: player1.User.avatar!,
      bingoProfile: {
        id: player1.id!,
        mmr: player1.mmr!,
        league: player1.league!,
        wins: player1.wins!,
        losses: player1.losses!,
        totalMatches: player1.totalMatches!,
      },
    },
  };
  const playerData2: PlayerData = {
    user: {
      googleId: player2.User.googleId!,
      displayName: player2.User.displayName!,
      avatar: player2.User.avatar!,
      bingoProfile: {
        id: player2.id!,
        mmr: player2.mmr!,
        league: player2.league!,
        wins: player2.wins!,
        losses: player2.losses!,
        totalMatches: player2.totalMatches!,
      },
    },
  };

  return [playerData1, playerData2];
};

export const amazing = async () => {
  const games = await gameServices.getAllGames();
  console.log('this is games', games[0].players)
  // Use for...of to properly handle async operations within the loop
  const results = [];
  for (const game of games) {
    const player1 = game.players[0];
    const player2 = game.players[1];
    
    const playerData1: PlayerData = {
      user: {
        googleId: player1.User.googleId!,
        displayName: player1.User.displayName!,
        avatar: player1.User.avatar!,
        bingoProfile: {
          id: player1.id!,
          mmr: player1.mmr!,
          league: player1.league!,
          wins: player1.wins!,
          losses: player1.losses!,
          totalMatches: player1.totalMatches!,
        },
      },
    };
    
    const playerData2: PlayerData = {
      user: {
        googleId: player2.User.googleId!,
        displayName: player2.User.displayName!,
        avatar: player2.User.avatar!,
        bingoProfile: {
          id: player2.id!,
          mmr: player2.mmr!,
          league: player2.league!,
          wins: player2.wins!,
          losses: player2.losses!,
          totalMatches: player2.totalMatches!,
        },
      },
    };

    const moveCount = game.matchHistory.length;
    let player1_gameBoard: PlayerGameboardData | undefined;
    let player2_gameBoard: PlayerGameboardData | undefined;

    // Loop through the game boards to find the relevant game boards
    for (const board of game.gameboards as unknown as PlayerGameboardData[]) {
      if (board.playerId === player1.id) {
        player1_gameBoard = board;
      } else if (board.playerId === player2.id) {
        player2_gameBoard = board;
      }
    }

    // Ensure player game boards are found before proceeding
    if (player1_gameBoard && player2_gameBoard) {
      results.push([game.gameId, playerData1, playerData2, player1_gameBoard.gameBoard, player2_gameBoard.gameBoard, moveCount]);
    } else {
      console.error('Game boards for players not found');
    }
  }

  return results; // Return the collected results after processing all games
};
