import { client } from "@repo/db/client";
import {
  BoxesValue,
  GET_GAME,
  Goals,
  MatchHistory,
  PlayerData,
  PlayerGameboardData,
} from "@repo/messages/message";
import { createClient } from "redis";

import {
  QUEUE_NAME,
  REDIS_PAYLOAD_AddMove,
  REDIS_PAYLOAD_END_GAME,
  REDIS_PAYLOAD_NewGame,
  REDIS_PAYLOAD_SentFriendRequest,
  REDIS_PAYLOAD_TossUpdate,
} from "../types";
import { getRedisClient } from "../config";

export const redis_newGame = async (
  gameId: string,
  tossWinner: string,
  players: PlayerData[],
  playerGameboardData: PlayerGameboardData[]
) => {
  const client = getRedisClient();

  try {
    const newGameObj: REDIS_PAYLOAD_NewGame = {
      type: "new-game",
      payload: {
        gameId,
        players,
        tossWinner,
        playerGameboardData,
      },
    };

    await client.lPush(QUEUE_NAME, JSON.stringify(newGameObj));
  } catch (error) {
    console.error("Error interacting with Redis:", error);
  }
};

export const redis_addMove = async (gameId: string, data: MatchHistory[0]) => {
  const client = await redisClient;

  try {
    const obj: REDIS_PAYLOAD_AddMove = {
      type: "add-move",
      payload: {
        gameId,
        data,
      },
    };

    // Push the new move into the Redis queue
    await client.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  }
};

export const redis_tossGameUpdate = async (
  gameId: string,
  players: PlayerData[],
  playerGameBoardData: PlayerGameboardData[]
) => {
  const client = await redisClient;

  try {
    const obj: REDIS_PAYLOAD_TossUpdate = {
      type: "toss-update-game",
      payload: {
        gameId,
        players,
        playerGameBoardData,
      },
    };

    // Push the new move into the Redis queue
    await client.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  }
};

export const redis_saveEndGame = async ({
  gameId,
  winner,
  loser,
  gameEndMethod,
}: REDIS_PAYLOAD_END_GAME["payload"]) => {
  const client = await redisClient;

  try {
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
    await client.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  }
};

export const redis_sentFriendRequest = async ({
  from,
  to,
}: REDIS_PAYLOAD_SentFriendRequest["payload"]) => {
  const client = await redisClient;

  try {
    const obj = {
      type: "friend-requests",
      payload: {
        from,
        to,
      },
    };

    await client.lPush(QUEUE_NAME, JSON.stringify(obj));
  } catch (error) {
    console.error("Error interacting with Redis in redis_addMove:", error);
  }
};
