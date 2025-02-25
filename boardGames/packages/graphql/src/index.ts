import { mergeTypeDefs } from "@graphql-tools/merge";
import { prismaTypeDefs } from "./typeDefs/prismaTypeDefs";
import { featureTypeDefs } from "./typeDefs/featureTypeDefs";

export const typeDefs = mergeTypeDefs([prismaTypeDefs, featureTypeDefs]);
    