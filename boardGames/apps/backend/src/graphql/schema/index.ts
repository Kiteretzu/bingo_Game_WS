import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDef } from "./user.TypeDefs";


export const typeDefs = mergeTypeDefs([userTypeDef])