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

  enum FriendRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type FUser {
    googleId: String!
    displayName: String
    email: String
    avatar: String
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
    friends: [FUser]
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
  }

  type BingoGame {
    gameId: String!
    players: [BingoProfile]!
    tier: BingoGameTier!
    gameboards: [JSON]!
    matchHistory: [JSON]!
    winMethod: Win_method
    createdAt: String
    gameEndedAt: String
    tossWinnerId: String
    gameWinnerId: String
    gameLoserId: String
    winMMR: Int
    loserMMR: Int
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

  type FriendRequest {
    id: String!
    senderId: String!
    receiverId: String!
    status: FriendRequestStatus!
    createdAt: String!
    updatedAt: String!
    sender: User!
    receiver: User!
  }

  type Friendship {
    id: String!
    user1Id: String!
    user2Id: String!
    createdAt: String!
    updatedAt: String!
    user1: User
    user2: User
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
    friendRequests: [FriendRequest]!
    friends(googleId: String!): [FUser]!
    gameHistory(bingoProfileId: String, limit: Int): [BingoGame]!
  }

  type Mutation {
    sendFriendRequest(googleId: String!): FriendRequest
    acceptFriendRequest(requestId: String!): FriendRequest
    declineFriendRequest(requestId: String!): FriendRequest
    removeFriend(googleId: String!): Boolean
  }
`;
