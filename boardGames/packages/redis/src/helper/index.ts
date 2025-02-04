import { client } from "@repo/db/client";
import {
  BoxesValue,
  GET_GAME,
  Goals,
  PlayerData,
  PlayerGameboardData,
} from "../../../games/src/mechanics/bingo/messages";
import { createClient } from "redis";

import {
  QUEUE_NAME,
  REDIS_PAYLOAD_AddMove,
  REDIS_PAYLOAD_END_GAME,
  REDIS_PAYLOAD_NewGame,
  REDIS_PAYLOAD_SentFriendRequest,
  REDIS_PAYLOAD_TossUpdate,
} from "../types";

export const redis_newGame = async (
  gameId: string,
  tossWinner: string,
  players: PlayerData[],
  playerGameboardData: PlayerGameboardData[]
) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const newGameObj: REDIS_PAYLOAD_NewGame = {
      type: "new-game",
      payload: {
        gameId,
        players,
        tossWinner,
        playerGameboardData,
      },
    };

    await redisClient.lPush(QUEUE_NAME, JSON.stringify(newGameObj));
  } catch (error) {
    console.error("Error interacting with Redis:", error);
  } finally {
    await redisClient.disconnect();
  }
};

export const redis_addMove = async (
  gameId: string,
  moveCount: number,
  value: BoxesValue,
  by: string,
  time: any
) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const obj: REDIS_PAYLOAD_AddMove = {
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
    await redisClient.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  } finally {
    await redisClient.disconnect();
  }
};

export const redis_tossGameUpdate = async (
  gameId: string,
  players: PlayerData[]
) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const obj: REDIS_PAYLOAD_TossUpdate = {
      type: "toss-update-game",
      payload: {
        gameId,
        players,
      },
    };

    // Push the new move into the Redis queue
    await redisClient.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  } finally {
    await redisClient.disconnect();
  }
};

export const redis_saveEndGame = async ({
  gameId,
  winner,
  loser,
  gameEndMethod,
}: REDIS_PAYLOAD_END_GAME["payload"]) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const obj: REDIS_PAYLOAD_END_GAME = {
      type: "end-game",
      payload: {
        gameId,
        winner,
        loser,
        gameEndMethod,
      },
    };

    // Push the new move into the Redis queue
    await redisClient.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  } finally {
    await redisClient.disconnect();
  }
};

export const redis_sentFriendRequest = async ({
  from,
  to,
}: REDIS_PAYLOAD_SentFriendRequest["payload"]) => {
  const redisClient = createClient();

  try {
    await redisClient.connect();

    const obj = {
      type: "friend-requests",
      payload: {
        from,
        to,
      },
    };

    await redisClient.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  } finally {
    await redisClient.disconnect();
  }
};
