import { gql } from "apollo-server-express";

export const featureTypeDefs = gql`
  type LeaderboardEntry {
    id: ID!
    displayName: String!
    mmr: Int!
    rank: Int!
  }

  type Query {
    leaderboard(limit: Int!): [LeaderboardEntry!]!
    validGameId(gameId: String!): Boolean!
  }
`;
