import { GraphQLError } from "graphql";
import { Context } from "graphql-passport/lib/buildContext";
import GraphQLJSON from "graphql-type-json";
import { CustomContext } from "helper/customContext";
import { FriendRequest, FUser, Resolvers } from "@repo/graphql/types/server";
import { BingoGame, BingoProfile, client, User } from "@repo/db/client";
import { leaderboardService } from "@repo/redis/services";
import { Friendship } from "@repo/graphql/types/client";
import { get } from "http";
import {
  getBingoProfileByUserId,
  getFriendsByUserId,
  getGameHistoryByBingoId,
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

      console.log("user check1");

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
      const history = await getGameHistoryByBingoId(
        bingoProfileId,
        Number(limit) || 10
      );
      return history || [];
    },

    // leaderboard
    leaderboard: async (parent, args, context) => {
      const { limit } = args;

      // Implement the logic to fetch leaderboard entries
      const leaderboardEntries = await leaderboardService.getLeaderboard(limit);
      return leaderboardEntries;
    },

    friends: async (parent, args, context) => getFriendsByUserId(args.googleId),

    friendRequests: async (parent, args, context) => {
      const user = await context.getUser();
      if (!user) {
        throw new GraphQLError("User not authenticated");
      }
      // Implement the logic to fetch friend requests
      const friendRequests = await client.friendRequest.findMany({
        where: {
          receiverId: user.googleId,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      return friendRequests as unknown as FriendRequest[]; // dont know why this is needed
    },
  },
  Mutation: {
    sendFriendRequest: async (parent, args, context) => {
      const { googleId } = args;
      console.log("Here");
      const user = await context.getUser();
      console.log("this is googleId", user?.googleId);
      if (!user) {
        throw new GraphQLError("User not authenticated");
      }

      // Implement the logic to send a friend request
      const friendRequest = await client.friendRequest.create({
        data: {
          senderId: user.googleId,
          receiverId: googleId,
        },
        include: {
          receiver: true,
          sender: true,
        },
      });

      console.log("this is friendRequest", friendRequest);
      return friendRequest as unknown as FriendRequest; // dont know why this is needed
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

      const friendship = await client.friendship.create({
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
    gameHistory: async (parent, args, context) => {
      const history = await getGameHistoryByBingoId(parent.id);
      return history || [];
    },
  },
};
