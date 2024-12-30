"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const merge_1 = require("@graphql-tools/merge");
const user_Resolver_1 = require("./user.Resolver");
exports.resolvers = (0, merge_1.mergeResolvers)([user_Resolver_1.userResolvers]);
