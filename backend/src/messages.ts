import { BoxesValue } from "./util/gameBoards"

export const GAME_INIT='game_init'


interface Data {
    gameId: string
    value: BoxesValue
}

export interface Message {
    type: string
    data: Data
}


export const ADD_VALUE_TO_BOX = "add_value_to_box";
export const ADD_CHECK_MARK = "add_check_mark";