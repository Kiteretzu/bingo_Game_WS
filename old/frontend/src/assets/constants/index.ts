export enum MessageType {
  GAME_INIT = 'game_init',
  CANCEL_GAME_INIT = 'cancel_game_init',
  ADD_VALUE_TO_BOX = 'add_value_to_box',
  ADD_CHECK_MARK = 'add_check_mark',
  RESPONSE= 'server_response',
  SEND_ID = 'send_game_id',
  SEND_CHECKBOXES = 'send_check_boxes',
  SEND_GAMEBOARD = 'send_game_board'
}

// Export individual constants for compatibility
export const GAME_INIT = MessageType.GAME_INIT;
export const CANCEL_GAME_INIT = MessageType.CANCEL_GAME_INIT
export const ADD_VALUE_TO_BOX = MessageType.ADD_VALUE_TO_BOX;
export const ADD_CHECK_MARK = MessageType.ADD_CHECK_MARK;
export const SEND_CHECKBOXES = MessageType.SEND_CHECKBOXES;
export const SEND_GAMEBOARD = MessageType.SEND_GAMEBOARD
export const SEND_ID = MessageType.SEND_ID
export const RESPONSE = MessageType.RESPONSE