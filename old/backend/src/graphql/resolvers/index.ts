import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user.Resolver";

export const resolvers = mergeResolvers([userResolvers])