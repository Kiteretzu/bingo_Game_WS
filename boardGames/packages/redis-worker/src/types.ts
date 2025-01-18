import { EndGame, GameEndMethod, Goals } from "@repo/games/bingo/messages";

export enum REQUESTS {
  BINGO_NEW_GAME = "Food",
  BINGO_ADD_MOVE = "Entertainment",
}


export interface REDIS_PAYLOAD_END_GAME {
  type: "end-game";
  payload: {
    gameId: string;
    winner: EndGame['winner']
    loser: EndGame['loser']
    winMethod: EndGame['winMethod'];
  };
}

// // Export individual keys
// export const BINGO_NEW_GAME = TransactionCategory.BINGO_NEW_GAME;
// export const BINGO_ADD_MOVE = TransactionCategory.BINGO_ADD_MOVE;
