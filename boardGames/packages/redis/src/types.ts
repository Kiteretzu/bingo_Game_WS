import {
  BoxesValue,
  EndGame,
  GameEndMethod,
  Goals,
  MatchHistory,
  PlayerData,
  PlayerGameboardData,
} from "@repo/messages/message";

export const QUEUE_NAME = "db-requests";

export interface REDIS_PAYLOAD_END_GAME {
  type: "end-game";
  payload: {
    gameId: string;
    winner: EndGame["winner"];
    loser: EndGame["loser"];
    gameEndMethod: EndGame["gameEndMethod"];
  };
}

export interface REDIS_PAYLOAD_TossUpdate {
  type: "toss-update-game";
  payload: {
    gameId: string;
    players: PlayerData[];
    playerGameBoardData: PlayerGameboardData[];
  };
}

export interface REDIS_PAYLOAD_AddMove {
  type: "add-move";
  payload: {
    gameId: string;
    data: MatchHistory[0];
  };
}

export interface REDIS_PAYLOAD_NewGame {
  type: "new-game";
  payload: {
    gameId: string;
    players: PlayerData[];
    playerGameboardData: PlayerGameboardData[];
    tossWinner: string;
  };
}

export interface REDIS_PAYLOAD_SentFriendRequest {
  type: "friend-requests";
  payload: {
    from: string;
    to: string;
  };
}
