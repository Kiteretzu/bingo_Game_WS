import {
  GET_RESPONSE,
  MessageType,
  GET_GAME,
  PAYLOAD_GET_GAME,
  PAYLOAD_PUT_GET_CHECK_MARK,
  GET_CHECK_MARK,
  GET_CHECKBOXES,
  GET_VICTORY,
  GET_LOST,
  PAYLOAD_GET_RECIEVE_EMOTE,
  PAYLOAD_GET_UPDATED_GAME,
  GET_UPDATED_GAME,
  GET_RECONNECT,
  GET_RECIEVE_EMOTE,
  PAYLOAD_GET_RECONNECT,
  GET_ADD_FRIEND,
  PAYLOAD_GET_ADD_FRIEND,
} from "@repo/messages/message";
import { WebSocket } from "ws";

export function sendPayload(
  to: WebSocket,
  type: MessageType,
  data?: any
): void {
  switch (type) {
    
    case GET_RESPONSE: {
      console.log('called ?', data);
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
      to.send(JSON.stringify(data as PAYLOAD_GET_GAME));
      break;
    }

    case GET_CHECK_MARK: {
      to.send(JSON.stringify(data as PAYLOAD_PUT_GET_CHECK_MARK));
      break;
    }

    case GET_CHECKBOXES: {
      console.log("Depreciated");
      to.send(JSON.stringify(data as PAYLOAD_PUT_GET_CHECK_MARK));
      break;
    }

    case GET_UPDATED_GAME: {
      to.send(JSON.stringify(data as PAYLOAD_GET_UPDATED_GAME));
      break;
    }

    case GET_VICTORY: {
      to.send(
        JSON.stringify({
          type,
          payload: data, // Send an empty payload for GET_VICTORY
        })
      );
      break;
    }

    case GET_LOST: {
      to.send(
        JSON.stringify({
          type,
          payload: data, // Send an empty payload for GET_LOST
        })
      );
      break;
    }

    case GET_RECIEVE_EMOTE: {
      to.send(
        JSON.stringify({
          type,
          payload: data as PAYLOAD_GET_RECIEVE_EMOTE["payload"],
        })
      );
      break;
    }

    case GET_RECONNECT: {
      to.send(JSON.stringify(data as PAYLOAD_GET_RECONNECT));
      break;
    }

    case GET_ADD_FRIEND: {
      to.send(JSON.stringify(data as PAYLOAD_GET_ADD_FRIEND));
    }
  }
}
