// Define the box names from 'a' to 'y'
export type BoxesName =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "";
// Define the possible values for each box, from '1' to '25'
export type BoxesValue =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25";

// Define the type for each box object in dummyData
export type Box = {
  boxName: BoxesName;
  boxValue: BoxesValue;
};

// Define the game board type
export type GameBoard = Box[];

export enum GameEndMethod {
  RESIGNATION = "RESIGNATION",
  ABANDON = "ABANDON",
  BINGO = "BINGO",
}

export const RESIGNATION = GameEndMethod.RESIGNATION;
export const ABANDON = GameEndMethod.ABANDON;
export const BINGO = GameEndMethod.BINGO;

// Enum for message types
export enum MessageType {
  PUT_GAME_INIT = "put_game_init",
  PUT_CANCEL_GAME_INIT = "put_cancel_game_init",
  PUT_CHECK_MARK = "put_check_mark",
  PUT_VALUE_TO_BOX = "put_value_to_box",
  PUT_RESIGN = "put_resign",
  PUT_TOSS_DECISION = "put_toss_decision",
  PUT_SEND_EMOTE = "put_send_emote",
  PUT_CHALLENGE = "put_challange",
  PUT_ADD_FRIEND = "put_add_friend",
  // all get
  GET_RESPONSE = "get_server_response",
  GET_GAME = "get_game",
  GET_CHECK_MARK = "get_check_mark",
  GET_CHECKBOXES = "get_check_boxes",
  GET_VICTORY = "get_victory",
  GET_LOST = "get_lost",
  GET_UPDATED_GAME = "get_updated_game",
  GET_RECIEVE_EMOTE = "get_recieve_emote",
  GET_RECONNECT = "get_reconnect",
  GET_REFRESH = "get_refresh",
  GET_CHALLENGE = "get_challange",
  GET_ADD_FRIEND = "get_add_friend",
  // consideration
  // GET_GAME_ID = "get_game_id",
  // GET_GAMEBOARD = "send_game_board",
}

// server response mesages
export const RESPONSE_WAITING_PLAYER = "Waiting for another player...";

// Export individual constants for compatibility
export const PUT_GAME_INIT = MessageType.PUT_GAME_INIT;
export const PUT_CANCEL_GAME_INIT = MessageType.PUT_CANCEL_GAME_INIT;
export const PUT_VALUE_TO_BOX = MessageType.PUT_VALUE_TO_BOX;
export const PUT_CHECK_MARK = MessageType.PUT_CHECK_MARK;
export const PUT_RESIGN = MessageType.PUT_RESIGN;
export const GET_CHECK_MARK = MessageType.GET_CHECK_MARK;
export const GET_RESPONSE = MessageType.GET_RESPONSE;
export const GET_GAME = MessageType.GET_GAME;
export const GET_CHECKBOXES = MessageType.GET_CHECKBOXES;
export const GET_VICTORY = MessageType.GET_VICTORY;
export const GET_LOST = MessageType.GET_LOST;
export const PUT_SEND_EMOTE = MessageType.PUT_SEND_EMOTE;
export const GET_RECIEVE_EMOTE = MessageType.GET_RECIEVE_EMOTE;
export const PUT_TOSS_DECISION = MessageType.PUT_TOSS_DECISION;
export const GET_UPDATED_GAME = MessageType.GET_UPDATED_GAME;
export const GET_RECONNECT = MessageType.GET_RECONNECT;
export const GET_REFRESH = MessageType.GET_REFRESH;
export const PUT_CHALLENGE = MessageType.PUT_CHALLENGE;
export const GET_CHALLENGE = MessageType.GET_CHALLENGE;
export const PUT_ADD_FRIEND = MessageType.PUT_ADD_FRIEND;
export const GET_ADD_FRIEND = MessageType.GET_ADD_FRIEND;

// Data interface for the message data
export interface DATA {
  gameId: string;
  value: BoxesValue;
}

export interface PAYLOAD_GET_GAME {
  type: MessageType.GET_GAME;
  payload: {
    gameId: string;
    tossWinnerId: string;
    players: PlayerData[]; // send playersId only
    gameBoard: Box[];
  };
}

export interface PAYLOAD_GET_RECONNECT {
  type: MessageType.GET_RECONNECT;
  payload: PAYLOAD_GET_GAME["payload"];
}

export interface PAYLOAD_GET_ADD_FRIEND {
  type: MessageType.GET_ADD_FRIEND;
  payload: {
    fromName: string;
    fromId: string;
  };
}

export type ChallengeSchema = {
  challangeId: string;
  senderId: string;
  receiverId: string;
  gameName: "BINGO";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  matchTier: "A" | "B" | "C" | "D" | "E";
  createdAt: number;
};

export interface PAYLOAD_PUT_CHALLENGE {
  type: MessageType.PUT_CHALLENGE;
  payload: ChallengeSchema;
}

export interface PAYLOAD_PUT_ADD_FRIEND {
  type: MessageType.PUT_ADD_FRIEND;
  payload: {
    to: string;
  };
}

export interface PAYLOAD_GET_CHALLENGE {
  type: MessageType.GET_CHALLENGE;
  payload: ChallengeSchema;
}

export interface PAYLOAD_GET_RESPONSE {
  type: MessageType.GET_RESPONSE;
  payload: {
    message: string;
  };
}

export enum GoalType {
  FIRST_BLOOD = "First blood",
  DOUBLE_KILL = "Double Kill",
  TRIPLE_KILL = "Triple Kill",
  RAMPAGE = "RAMPAGE",
  PERFECTIONIST = "Perfectionist",
}

// Type for Goals: Array of objects with exactly one GoalType key
export type Goals = {
  goalName: GoalType;
  isCompleted: boolean;
};

export interface PAYLOAD_GET_UPDATED_GAME {
  type: MessageType.GET_UPDATED_GAME;
  payload: {
    checks: PAYLOAD_GET_CHECKBOXES["payload"];
    goals: Goals[];
    matchHistory: MatchHistory;
  };
}

export interface PAYLOAD_GET_VICTORY {
  type: MessageType.GET_VICTORY;
  payload: {
    method: GameEndMethod;
    message: string;
    data: WinnerMMR | null;
  };
}
export interface PAYLOAD_GET_LOST {
  type: MessageType.GET_LOST;
  payload: {
    method: GameEndMethod;
    message: string;
    data: LoserMMR | null;
  };
}

export interface PAYLOAD_PUT_SEND_EMOTE {
  type: MessageType.PUT_SEND_EMOTE;
  payload: {
    gameId: string;
    emote: string;
  };
}

export interface PAYLOAD_GET_RECIEVE_EMOTE {
  type: MessageType.GET_RECIEVE_EMOTE;
  payload: {
    emote: string;
  };
}

export interface PAYLOAD_PUT_GET_CHECK_MARK {
  type: MessageType.PUT_CHECK_MARK | MessageType.GET_CHECK_MARK;
  payload: {
    gameId: string;
    value: BoxesValue;
  };
}

export interface PAYLOAD_GET_CHECKBOXES {
  type: MessageType.GET_CHECKBOXES;
  payload: {
    checkedBoxes: BoxesName[];
    checkedLines: BoxesName[][];
  };
}

export interface PAYLOAD_PUT_GAME_INIT {
  type: MessageType.PUT_GAME_INIT;
  payload: {
    token: string;
    gameType: "BINGO" | "BINGO-6";
    matchTier: "A" | "B" | "C" | "D" | "E" | "F";
  };
}

export interface PAYLOAD_PUT_RESIGN {
  type: MessageType.PUT_RESIGN;
  payload: {
    gameId: string;
  };
}

export interface PAYLOAD_PUT_TOSS_DECISION {
  type: MessageType.PUT_TOSS_DECISION;
  payload: {
    decision: TossDecision;
  };
}

export interface PAYLOAD_PUT_CANCEL_GAME_INIT {
  type: MessageType.PUT_CANCEL_GAME_INIT;
}

export type SEND_GAMEBOARD_DATA = Box[];
export type SEND_ID_DATA = string;

// Message interface with type constrained to the MessageType enum
export interface Message {
  type: MessageType; // type is now an enum value
  payload: any;
}

// player data stored i
// very DIfferent

interface PlayerProfile {
  id: string;
  mmr: number;
  league: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
}

export interface PlayerData {
  user: {
    googleId: string;
    displayName: string;
    avatar: string;
    bingoProfile: PlayerProfile;
  };
}

export type MatchHistory = {
  move: number;
  value: BoxesValue;
  by: string;
  timestamp: number;
}[];

export interface PlayerGameboardData {
  gameBoard: GameBoard;
}

export enum TossDecision {
  TOSS_GO_FIRST = "toss-go-first",
  TOSS_GO_SECOND = "toss-go-second",
}

// very important

export type WinnerMMR = {
  totalWinningPoints: number;
  baseWinningPoints: number;
  firstBloodPoints: number;
  doubleKillPoints: number;
  tripleKillPoints: number;
  perfectionistPoints: number;
  rampagePoints: number;
};

export type LoserMMR = {
  totalLosingPoints: number;
  baseLosingPoints: number;
};

export interface EndGame {
  winner: {
    id: string;
    winnerMMR: WinnerMMR;
    winnerGoal: Goals[];
    lineCount: number;
  };
  loser: {
    id: string;
    loserMMR: LoserMMR;
    loserGoal: Goals[];
    lineCount: number;
  };
  gameEndMethod: GameEndMethod;
}
