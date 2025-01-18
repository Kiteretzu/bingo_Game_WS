import { client } from "@repo/db/client";
import {
  BoxesValue,
  GET_GAME,
  Goals,
  PlayerData,
  PlayerGameboardData,
} from "@repo/games/bingo/messages";
import { createClient } from "redis";

import { REDIS_PAYLOAD_END_GAME, REQUESTS } from "types";

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

export interface NewGameObj {
  gameId: string;
  tossWinner: string;
  players: PlayerData[];
  playerGameboardData: PlayerGameboardData[];
}

export interface NewGame {
  type: "new-game";
  payload: NewGameObj;
}

export const redis_newGame = async (
  gameId: string,
  tossWinner: string,
  players: PlayerData[],
  playerGameboardData: PlayerGameboardData[]
) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const newGameObj: NewGame = {
      type: "new-game",
      payload: {
        gameId,
        players,
        tossWinner,
        playerGameboardData,
      },
    };

    await redisClient.lPush("game-requests", JSON.stringify(newGameObj));
  } catch (error) {
    console.error("Error interacting with Redis:", error);
  } finally {
    await redisClient.disconnect();
  }
};

export interface AddMove {
  type: "add-move";
  payload: {
    gameId: string;
    moveCount: number;
    value: BoxesValue;
    by: string;
    time: any; // Replace `any` with a more specific type if possible, such as `Date` or `string`.
  };
}

export const redis_addMove = async (
  gameId: string,
  moveCount: number,
  value: BoxesValue,
  by: string,
  time: any,
) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const obj: AddMove = {
      type: "add-move",
      payload: {
        gameId,
        moveCount,
        value,
        by,
        time,
      },
    };

    // Push the new move into the Redis queue
    await redisClient.lPush("game-requests", JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  } finally {
    await redisClient.disconnect();
  }
};

export interface TossGameUpdate {
  type: "toss-update-game";
  payload: {
    gameId: string;
    players: PlayerData[];
  };
}

export const redis_tossGameUpdate = async (
  gameId: string,
  players: PlayerData[]
) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const obj: TossGameUpdate = {
      type: "toss-update-game",
      payload: {
        gameId,
        players,
      },
    };

    // Push the new move into the Redis queue
    await redisClient.lPush("game-requests", JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  } finally {
    await redisClient.disconnect();
  }
};




export const redis_saveEndGame = async ({gameId, winner, loser, winMethod}: REDIS_PAYLOAD_END_GAME['payload']) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const obj: REDIS_PAYLOAD_END_GAME = {
      type: "end-game",
      payload: {
        gameId,
        winner,
        loser,
        winMethod
      },
    };

    // Push the new move into the Redis queue
    await redisClient.lPush("game-requests", JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  } finally {
    await redisClient.disconnect();
  }
}