import { BoxesName, BoxesValue, GameBoard } from "./util/gameBoards";

// Enum for message types
export enum MessageType {
  GAME_INIT = 'game_init',
  ADD_VALUE_TO_BOX = 'add_value_to_box',
  ADD_CHECK_MARK = 'add_check_mark',
  RESPONSE= 'server_response',
  SEND_ID = 'send_game_id',
  SEND_CHECKBOXES = 'send_check_boxes',
  SEND_GAMEBOARD = 'send_game_board'
}

// Export individual constants for compatibility
export const GAME_INIT = MessageType.GAME_INIT;
export const ADD_VALUE_TO_BOX = MessageType.ADD_VALUE_TO_BOX;
export const ADD_CHECK_MARK = MessageType.ADD_CHECK_MARK;
export const SEND_CHECKBOXES = MessageType.SEND_CHECKBOXES;
export const SEND_GAMEBOARD = MessageType.SEND_GAMEBOARD
export const SEND_ID = MessageType.SEND_ID
export const RESPONSE = MessageType.RESPONSE

// Data interface for the message data
export interface ADD_CHECK_MARK_DATA {
  gameId: string;
  value: BoxesValue;
}

export interface SEND_CHECKBOXES_DATA {
    checkedBoxes: BoxesName[]
    checkedLines: BoxesName[][]
}
export type SEND_GAMEBOARD_DATA = Partial<GameBoard>
export type SEND_ID_DATA = string

export type GameDataSend = ADD_CHECK_MARK_DATA | SEND_GAMEBOARD_DATA  | SEND_CHECKBOXES_DATA | SEND_ID_DATA

// Message interface with type constrained to the MessageType enum
export interface Message {
  type: MessageType;  // type is now an enum value
  data: GameDataSend
}