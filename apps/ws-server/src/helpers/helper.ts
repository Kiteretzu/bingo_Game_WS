import { GetServerPlayerProfileDocument } from "@repo/graphql/types/client";
import { PlayerData } from "@repo/messages/message";
import jwt from "jsonwebtoken";
import { DECODED_TOKEN } from "types";
const { request } = require("graphql-request");

export async function getPlayerData(token: string): Promise<PlayerData | null> {
  try {
    // Decode the JWT token to extract googleId
    const googleId = verifyToken(token).googleId;

    // Prepare the variables for the GraphQL query
    const variables = { googleId };

    // Fetch the player data from the server using the GraphQL request
    const playerData = await request(
      "http://localhost:8080/graphql",
      GetServerPlayerProfileDocument,
      variables
    );

    if (!playerData) {
      console.error("Player data not found in database");
      return null;
    }

    return playerData as PlayerData;
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

// export const formatToPlayersData = (
//   game: BingoGame & BingoProfile
// ): PlayerData[] => {
//   const player1 = game.players[0];
//   const player2 = game.players[1];
//   const playerData1: PlayerData = {
//     user: {
//       googleId: player1.User.googleId!,
//       displayName: player1.User.displayName!,
//       avatar: player1.User.avatar!,
//       bingoProfile: {
//         id: player1.id!,
//         mmr: player1.mmr!,
//         league: player1.league!,
//         wins: player1.wins!,
//         losses: player1.losses!,
//         totalMatches: player1.totalMatches!,
//       },
//     },
//   };
//   const playerData2: PlayerData = {
//     user: {
//       googleId: player2.User.googleId!,
//       displayName: player2.User.displayName!,
//       avatar: player2.User.avatar!,
//       bingoProfile: {
//         id: player2.id!,
//         mmr: player2.mmr!,
//         league: player2.league!,
//         wins: player2.wins!,
//         losses: player2.losses!,
//         totalMatches: player2.totalMatches!,
//       },
//     },
//   };

//   return [playerData1, playerData2];
// };
