import { GraphQLError } from "graphql";
import { Context } from "graphql-passport/lib/buildContext";
import GraphQLJSON from "graphql-type-json";
import { CustomContext } from "helper/customContext";
import { FriendRequest, FUser, Resolvers } from "@repo/graphql/types/server";
import { BingoGame, BingoProfile, client, User } from "@repo/db/client";
import { leaderboardService } from "@repo/redis/services";
import {
  getBingoPlayerRecordsByProfileId,
  getBingoProfileByUserId,
  getFriendsByUserId,
  getGameHistoryByProfileId,
} from "../dbServices";

export const resolvers: Resolvers<CustomContext> = {
  JSON: GraphQLJSON,
  Query: {
    // Fake implementation for fetching the authenticated user

    authUser: async (parent, __, context): Promise<User | null> => {
      try {
        const user = await context.getUser();
        if (!user) {
          return null;
        }

        return user;
      } catch (error) {
        console.error("Error in authUser", error);
        throw new GraphQLError("Internal server error");
      }
    },
    user: async (parent, args, context) => {
      const { googleId } = args;

      if (!googleId) return null;
      const user = (await client.user.findUnique({
        where: {
          googleId,
        },
      })) as User;

      if (!user) {
        return null;
      }
      return user;
    },

    gameHistory: async (parent, args, context) => {
      let { bingoProfileId, limit } = args;
      if (!bingoProfileId) {
        // not given
        const user = await context.getUser();

        bingoProfileId = user?.bingoProfile.id || "";
        if (!bingoProfileId) {
          throw new GraphQLError("Bingo profile ID not found");
        }
      }

      const history = await getGameHistoryByProfileId(bingoProfileId);

      return history || [];
    },

    // leaderboard
    leaderboard: async (parent, args, context) => {
      const { limit } = args;
      // Implement the logic to fetch leaderboard entries

      console.log("leaderCheck1")
      const leaderboardEntries = await leaderboardService.getLeaderboard(limit);
      console.log("leaderCheck2")
      return leaderboardEntries;
    },

    bingoPlayerRecords: async (parent, args, context) => {
      const user = await context.getUser();
      if (!user) {
        throw new GraphQLError("User not authenticated");
      }
      const profileId = user.bingoProfile.id;

      return await getBingoPlayerRecordsByProfileId(profileId, args.profileId);
    },

    friends: async (parent, args, context) => {
      const user = await context.getUser();
      let googleId = user?.googleId;
      if (!user) {
        googleId = args.googleId || "";
      }
      if (!googleId) {
        throw new GraphQLError("Google ID not found");
      }
      return await getFriendsByUserId(googleId);
    },

    getFriendRequest: async (parent, args, context) => {
      const user = await context.getUser();
      if (!user) {
        throw new GraphQLError("User not authenticated");
      }
      // Implement the logic to fetch friend requests
      const friendRequests = await client.friendRequest.findMany({
        where: {
          receiverId: user.googleId,
          status: "PENDING",
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          sender: true,
          receiver: true,
        },
      });

      return friendRequests as unknown as FriendRequest[]; // dont know why this is needed
    },
  },
  Mutation: {
    sendFriendRequest: async (parent, args, context) => {
      const { from, to } = args;

      // Check if they are already friends
      const friends = await getFriendsByUserId(from);
      if (friends.some((friend) => friend.googleId === to)) {
        throw new GraphQLError("You are already friends");
      }

      // Check if a friend request already exists
      const existingRequest = await client.friendRequest.findFirst({
        where: {
          senderId: from,
          receiverId: to,
          status: "PENDING",
        },
      });
      if (existingRequest) {
        throw new GraphQLError(
          "Friend request already exists or you are already friends."
        );
      }

      // Create and send the friend request
      const friendRequest = await client.friendRequest.create({
        data: {
          senderId: from,
          receiverId: to,
        },
        include: {
          receiver: true,
          sender: true,
        },
      });

      console.log("Friend request created:", friendRequest);
      return friendRequest as unknown as FriendRequest; // Type assertion if needed
    },
    acceptFriendRequest: async (parent, args, context) => {
      const { requestId } = args;
      const user = await context.getUser();
      if (!user) {
        throw new GraphQLError("User not authenticated");
      }

      // Implement the logic to accept a friend request
      const friendRequest = await client.friendRequest.findUnique({
        where: {
          id: requestId,
        },
      });

      if (!friendRequest) {
        throw new GraphQLError("Friend request not found");
      }

      if (friendRequest.receiverId !== user.googleId) {
        throw new GraphQLError("Unauthorized");
      }

      await client.friendship.create({
        data: {
          user1Id: friendRequest.senderId,
          user2Id: friendRequest.receiverId,
        },
      });

      // deleting t
      const acceptedFriendRequest = await client.friendRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      return acceptedFriendRequest as unknown as FriendRequest; // dont know why this is needed
    },

    declineFriendRequest: async (parent, args, context) => {
      const { requestId } = args;
      const user = await context.getUser();
      if (!user) {
        throw new GraphQLError("User not authenticated");
      }

      // Implement the logic to decline a friend request
      const friendRequest = await client.friendRequest.findUnique({
        where: {
          id: requestId,
        },
      });

      if (!friendRequest) {
        throw new GraphQLError("Friend request not found");
      }

      if (friendRequest.receiverId !== user.googleId) {
        throw new GraphQLError("Unauthorized");
      }

      const declinedFriendRequest = await client.friendRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "REJECTED",
        },
      });

      return declinedFriendRequest as unknown as FriendRequest; // dont know why this is needed
    },
    removeFriend: async (parent, args, context) => {
      const { googleId } = args;
      const user = await context.getUser();
      if (!user) {
        throw new GraphQLError("User not authenticated");
      }

      // Implement the logic to remove a friend
      const friend = await client.user.findUnique({
        where: {
          googleId,
        },
      });

      if (!friend) {
        throw new GraphQLError("Friend not found");
      }

      const friendship = await client.friendship.findFirst({
        where: {
          OR: [
            {
              user1Id: user.googleId,
              user2Id: googleId,
            },
            {
              user1Id: googleId,
              user2Id: user.googleId,
            },
          ],
        },
      });

      if (!friendship) {
        throw new GraphQLError("Friendship not found");
      }

      await client.friendship.delete({
        where: {
          id: friendship.id,
        },
      });

      return true;
    },
  },

  User: {
    bingoProfile: async (parent, args, context) =>
      getBingoProfileByUserId(parent.googleId),
    friends: async (parent, args, context) =>
      getFriendsByUserId(parent.googleId),
  },
  BingoProfile: {
    gameHistory: async (parent, args, context) =>
      getGameHistoryByProfileId(parent.id),
  },
};
