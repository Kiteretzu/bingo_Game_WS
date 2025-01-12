import { client } from "@repo/db/client";
import { GET_GAME, PlayerData, PlayerGameboardData } from "@repo/games/bingo/messages";
import { createClient } from "redis";

import { REQUESTS } from "types";

// const getter = async (type: REQUESTS) => {
//     const timerstamp = Date.now()

//     switch(type) {
//         case BINGO_NEW_GAME: {
//               const newGame = await client.bingoGame.create({
//       data: {
//         players: {
//           connect: [
//             {id: this.player1_Data.bingoProfile.id},
//             {id: this.player2_Data.bingoProfile.id}
//           ]
//         }
//       }
//     })

//         }
//     }
// }

export const redis_newGame = async (gameId: string, players: PlayerData[], playerGameboardData: PlayerGameboardData[]) => {
  const redisClient = createClient();
  await redisClient.connect();
  
  const newGameObj = {
    gameId,
    players,
    playerGameboardData
  }

 await redisClient.lPush('new-game', JSON.stringify(newGameObj))
};

export interface newGameObj {
  gameId: string,
  players: PlayerData[],
  playerGameboardData: PlayerGameboardData[]
}