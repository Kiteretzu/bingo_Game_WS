import { GraphQLError } from "graphql";
import { Context } from "graphql-passport/lib/buildContext";
import GraphQLJSON from "graphql-type-json";
import { CustomContext } from "helper/customContext";
import { Resolvers } from "@repo/graphql/types/server";
import { client, User } from "@repo/db/client";
import { leaderboardService } from "@repo/redis-worker/services";

export const resolvers: Resolvers<CustomContext> = {
  JSON: GraphQLJSON,
  Query: {
    // Fake implementation for fetching the authenticated user

    authUser: async (parent, __, context) => {
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
      if(!googleId) return null
      const user = await client.user.findUnique({
        where: {
          googleId,
        },
        include: {
          bingoProfile: true,
        },
      }) as User 

      if (!user) {
        return null;
      }
      return user;
    },
    
    // leaderboard
    leaderboard: async (parent, args, context) => {
      const {limit} = args

      console.log('this is ', limit)
      // Implement the logic to fetch leaderboard entries
      const leaderboardEntries = await leaderboardService.getLeaderboard(limit)
      console.log('what the fuck is this', leaderboardEntries)
      return leaderboardEntries;
      
    }
  },
};
