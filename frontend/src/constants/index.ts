export enum MessageType {
  GAME_INIT = 'game_init',
  ADD_VALUE_TO_BOX = 'add_value_to_box',
  ADD_CHECK_MARK = 'add_check_mark',
}

export const GAME_INIT = MessageType.GAME_INIT;
export const ADD_VALUE_TO_BOX = MessageType.ADD_VALUE_TO_BOX;
export const ADD_CHECK_MARK = MessageType.ADD_CHECK_MARK;

export interface ADD_CHECK_MARK_DATA {
  gameId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}