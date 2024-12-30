import { GameDataSend, Message, MessageType } from "../ws/messages";
import { WebSocket } from "ws";

export function sendPayload(
  to: WebSocket,
  type?: MessageType,
  data?: GameDataSend ,
): void {
  if (type && data) {
    to.send(
      JSON.stringify({
        type,
        data,
      })
    );
  }
}
