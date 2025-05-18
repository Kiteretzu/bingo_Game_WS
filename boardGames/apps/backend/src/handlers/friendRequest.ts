import { MessageType } from "@repo/messages/message";
import { sendPayload } from "helper/wsSend";
import { GameManager } from "ws/GameManager";

export const handleFriendRequest = (msg: { to: string; from: string }) => {
  const socket = GameManager.getInstance().getSocket(msg.to);
  if (socket) {
    sendPayload(socket, MessageType.GET_ADD_FRIEND);
  }
};
