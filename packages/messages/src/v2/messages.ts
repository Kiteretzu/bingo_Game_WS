export enum RootMessageType {
    START_MATCHMAKING = "START_MATCHMAKING",
    CANCEL_MATCHMAKING = "CANCEL_MATCHMAKING",
    GAME_ACTION = "GAME_ACTION",
}

export enum GameType {
    BINGO = "BINGO",
    MONOPOLY = "MONOPOLY",
}

export enum BingoGameActionType {
    PUT_TOSS_DECISION = "bingo_put_toss_decision",
    PUT_CHECK_MARK = "bingo_put_check_mark",

}
export const PUT_TOSS_DECISION = BingoGameActionType.PUT_TOSS_DECISION;
export const PUT_CHECK_MARK = BingoGameActionType.PUT_CHECK_MARK;


export type BingoGameActionPayload = {
    type: BingoGameActionType;
    payload: any;
};

export type RootMessage = {
    type: RootMessageType;
    gameType: GameType;
    payload: BingoGameActionPayload;
};


// BINGO GAME ACTION MESSAGES

export enum TossDecision {
    TOSS_GO_FIRST = "toss-go-first",
    TOSS_GO_SECOND = "toss-go-second",
  }


export interface PAYLOAD_BINGO_PUT_TOSS_DECISION {
    type: BingoGameActionType.PUT_TOSS_DECISION;
    payload: {
      decision: TossDecision;
    };
  }