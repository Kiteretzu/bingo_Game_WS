import { MessageType } from "@repo/messages/message";
import { sendPayload } from "../helpers/wsSend";
import { GameManager } from "../GameManager";

export const handleFriendRequest = (msg: { to: string; from: string }) => {
  const socket = GameManager.getInstance().getSocket(msg.to);
  if (socket) {
    sendPayload(socket, MessageType.GET_ADD_FRIEND);
  }
};
