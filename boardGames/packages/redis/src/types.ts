import { EndGame, GameEndMethod, Goals } from "../../games/src/mechanics/bingo/messages";

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
    gameEndMethod: EndGame['gameEndMethod'];
  };
}

// // Export individual keys
// export const BINGO_NEW_GAME = TransactionCategory.BINGO_NEW_GAME;
// export const BINGO_ADD_MOVE = TransactionCategory.BINGO_ADD_MOVE;
