import { GraphQLError } from "graphql";
import { Context } from "graphql-passport/lib/buildContext";
import GraphQLJSON from "graphql-type-json";
import { CustomContext } from "helper/customContext";
import { Resolvers } from "@repo/graphql/types/server";


export const resolvers: Resolvers<CustomContext>  = {
  JSON: GraphQLJSON,
  Query: {
    // Fake implementation for fetching the authenticated user

    authUser: async (parent, __: any, context) => {
      try {
        const user = await context.getUser();
        if(!user) {return null}
        return user;
      } catch (error) {
        console.error("Error in authUser", error);
        throw new GraphQLError("Internal server error");
      }
    },
    // user: async (parent, args, context) => {
    //   const somethings = args.googleId
    // }
  },
};
