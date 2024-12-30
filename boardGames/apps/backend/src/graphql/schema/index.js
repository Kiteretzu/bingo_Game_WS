"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const merge_1 = require("@graphql-tools/merge");
const user_TypeDefs_1 = require("./user.TypeDefs");
exports.typeDefs = (0, merge_1.mergeTypeDefs)([user_TypeDefs_1.userTypeDef]);
