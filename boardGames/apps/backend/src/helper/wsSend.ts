import { GameDataSend, Message, MessageType } from "@repo/games/messages";
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
