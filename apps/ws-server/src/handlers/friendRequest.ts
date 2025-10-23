import { MessageType } from "@repo/messages/message";
import { sendPayload } from "../helpers/wsSend";
import { GameManager } from "games/bingo/GameManager";
import { UserManager } from "user/UserManager";

export const handleFriendRequest = (msg: { to: string; from: string }) => {
  const socket = UserManager.getInstance().getSocket(msg.to);
  if (socket) {
    sendPayload(socket, MessageType.GET_ADD_FRIEND);
  }
};
