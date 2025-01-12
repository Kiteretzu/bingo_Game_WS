import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  
  scalar JSON


   scalar JSON

  enum Leagues {
    BRONZE
    SILVER
    GOLD
    PLATINUM
    DIAMOND
    MASTER
    GRANDMASTER
  }

  enum Win_method {
    RESIGNATION
    ABANDON
    BINGO
  }

  # Types for GraphQL schema
  type User {
    googleId: String!
    displayName: String
    email: String
    avatar: String
    bingoProfile: BingoProfile
  }

  type BingoProfile {
    id: String!
    totalMatches: Int
    wins: Int
    losses: Int
    lines_count: Int
    firstBlood_count: Int
    doubleKill_count: Int
    tripleKill_count: Int
    perfectionist_count: Int
    rampage_count: Int
    mmr: Int
    league: Leagues
    preferredBoards: [JSON]
    gameHistory: [BingoGame]
    userId: String!
    user: User
  }

  type BingoGame {
    id: String!
    Players: [BingoProfile]
    gameboards: [JSON]
    matchHistory: [JSON]
    winMethod: Win_method
    gameWinnerId: String
    tossWinnerId: String
  }

  type BingoPlayerRecords {
    id: String!
    player1Id: String!
    player2Id: String!
    ratio: JSON
  }
  
  # Queries
  type Query {
    authUser: User
    # users: [User]
    user(googleId: String!): User
    # bingoProfiles: [BingoProfile]
    # bingoProfile(userId: String!): BingoProfile
    # bingoGames: [BingoGame]
    bingoGame(id: String!): BingoGame
    bingoPlayerRecords: [BingoPlayerRecords]
    bingoPlayerRecord(player1Id: String!, player2Id: String!): BingoPlayerRecords
  }
`;

export default typeDefs;