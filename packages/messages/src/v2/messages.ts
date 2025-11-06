export enum RootMessageType {
    START_MATCHMAKING = "START_MATCHMAKING",
    CANCEL_MATCHMAKING = "CANCEL_MATCHMAKING",
    GAME_ACTION = "GAME_ACTION",
}

export enum GameType {
    BINGO = "BINGO",
    MONOPOLY = "MONOPOLY",
}

export type RootMessage = {
    type: RootMessageType;
    gameType: GameType;
    payload: any;
};