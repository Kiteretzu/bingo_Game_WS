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

// Enum for message types
export enum MessageType {
  PUT_GAME_INIT = "put_game_init",
  PUT_CANCEL_GAME_INIT = "put_cancel_game_init",
  PUT_CHECK_MARK = "put_check_mark",
  PUT_VALUE_TO_BOX = "put_value_to_box",
  // all get
  GET_RESPONSE = "get_server_response",
  GET_GAME = "get_game",
  // consideration
  GET_GAME_ID = "get_game_id",
  GET_CHECKBOXES = "get_check_boxes",
  GET_GAMEBOARD = "send_game_board",
}

// server response mesages
export const RESPONSE_WAITING_PLAYER = "Waiting for another player...";

// Export individual constants for compatibility
export const PUT_GAME_INIT = MessageType.PUT_GAME_INIT;
export const PUT_CANCEL_GAME_INIT = MessageType.PUT_CANCEL_GAME_INIT;
export const PUT_VALUE_TO_BOX = MessageType.PUT_VALUE_TO_BOX;
export const PUT_CHECK_MARK = MessageType.PUT_CHECK_MARK;
export const GET_RESPONSE = MessageType.GET_RESPONSE;
export const GET_GAME = MessageType.GET_GAME;
export const GET_CHECKBOXES = MessageType.GET_CHECKBOXES;
export const GET_GAMEBOARD = MessageType.GET_GAMEBOARD;
export const GET_GAME_ID = MessageType.GET_GAME_ID;
// Data interface for the message data
export interface DATA {
  gameId: string;
  value: BoxesValue;
}

export interface PAYLOAD_GET_GAME {
  type: MessageType.GET_GAME
  payload: {
    gameId: string;
    players: string[]; // change it to sockets later
    gameBoard: Box[];
  }
}

export interface PAYLOAD_PUT_CHECK_MARK {
  type: MessageType.PUT_CHECK_MARK
  payload: {
    gameId: string;
    value: BoxesValue;
  }
}

export interface PAYLOAD_GET_CHECKBOXES {
  type: MessageType.GET_CHECKBOXES
  payload: {
    checkedBoxes: BoxesName[];
    checkedLines: BoxesName[][];
  }
}

export interface PAYLOAD_PUT_GAME_INIT {
  type: MessageType.PUT_GAME_INIT
  payload: {
    data: string // change it to something else
  }
}

export type SEND_GAMEBOARD_DATA = Box[];
export type SEND_ID_DATA = string;


// Message interface with type constrained to the MessageType enum
export interface Message {
  type: MessageType; // type is now an enum value
  payload: any;
}
