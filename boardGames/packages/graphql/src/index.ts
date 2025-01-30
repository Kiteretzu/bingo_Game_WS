import { mergeTypeDefs } from "@graphql-tools/merge";
import { prismaTypeDefs } from "./typeDefs/prismaTypeDefs";
import { featureTypeDefs } from "./typeDefs/featureTypeDefs";
import { friendsTypeDefs } from "./typeDefs/friendsTypeDefs";

export const typeDefs = mergeTypeDefs([prismaTypeDefs, featureTypeDefs, friendsTypeDefs]);
