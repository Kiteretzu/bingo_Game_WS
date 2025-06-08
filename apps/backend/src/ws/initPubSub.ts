//Initializes subscriptions using handlers
import { subscribeToChannel } from "@repo/redis/infra";
import { handleFriendRequest } from "../handlers/friendRequest";
import { CHANNELS } from "@repo/redis/infra";
import { handleMatchmaking } from "../handlers/matchmaking";
import { handleCheckMark } from "handlers/checkMark";
// import { handleChallenge } from "../handlers/challenge";

export const initSubscriptions = async () => {
  console.log("Initializing pubsub");
  await subscribeToChannel("FRIEND_REQUEST", handleFriendRequest);
  await subscribeToChannel("MATCHMAKING", handleMatchmaking);
  await subscribeToChannel("CHECK_MARK", handleCheckMark);
  //   await subscribeToChannel("CHALLENGE", handleChallenge);
};
