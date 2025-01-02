import {
  GET_RESPONSE,
  MessageType,
  GET_GAME,
  PAYLOAD_GET_GAME,
  PUT_CHECK_MARK,
  PAYLOAD_PUT_CHECK_MARK
} from "@repo/games/client/bingo/messages";
import { WebSocket } from "ws";
MessageType;


export function sendPayload(to: WebSocket, type: MessageType, data: any): void {
  switch (type) {
    case GET_RESPONSE: {
      to.send(
        JSON.stringify({
          type,
          payload: {
            message: data,
          },
        })
      );
      break;
    }
    
    case GET_GAME: {
      to.send(JSON.stringify(data as PAYLOAD_GET_GAME))
      break;
    }

    case PUT_CHECK_MARK: {
      to.send(JSON.stringify(data as PAYLOAD_PUT_CHECK_MARK))
    }
  }

}
