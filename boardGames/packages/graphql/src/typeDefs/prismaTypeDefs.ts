import { gql } from "apollo-server-express";

export const prismaTypeDefs = gql`
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



  enum BingoGameTier {
    A
    B
    C
    D
    E
  }

  type User {
    googleId: String!
    isAdmin: Boolean!
    displayName: String
    email: String
    avatar: String
    bingoProfile: BingoProfile
    sentRequests: [FriendRequest]
    receivedRequests: [FriendRequest]
    friendshipsAsUser1: [Friendship]
    friendshipsAsUser2: [Friendship]
  }


  type BingoProfile {
    id: String!
    totalMatches: Int!
    wins: Int!
    losses: Int!
    lines_count: Int!
    firstBlood_count: Int!
    doubleKill_count: Int!
    tripleKill_count: Int!
    perfectionist_count: Int!
    rampage_count: Int!
    mmr: Int!
    league: Leagues!
    preferredBoards: [JSON]!
    gameHistory: [BingoGame]!
    userId: String!
    user: User!
    recordsAsPlayer1: [BingoPlayerRecords]!
    recordsAsPlayer2: [BingoPlayerRecords]!
  }

  type BingoGame {
    gameId: String!
    players: [BingoProfile]!
    tier: BingoGameTier!
    gameboards: [JSON]!
    matchHistory: [JSON]!
    winMethod: Win_method
    gameWinnerId: String
    tossWinnerId: String
  }

  type BingoPlayerRecords {
    id: String!
    player1Id: String!
    player2Id: String!
    player1Wins: Int!
    player2Wins: Int!
    totalMatches: Int!
    lastPlayedAt: String!
    player1: BingoProfile!
    player2: BingoProfile!
  }

  type Query {
    authUser: User
    user(googleId: String!): User
    # bingoGame(id: String!): BingoGame
    # bingoPlayerRecords: [BingoPlayerRecords]
    # bingoPlayerRecord(
    #   player1Id: String!
    #   player2Id: String!
    # ): BingoPlayerRecords
  }

  
`;