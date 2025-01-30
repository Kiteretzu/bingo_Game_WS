import { gql } from "apollo-server-express";

export const friendsTypeDefs = gql`

  enum FriendRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
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

  type Mutation {
    sendFriendRequest(googleId: String!): FriendRequest
    acceptFriendRequest(requestId: String!): FriendRequest
    declineFriendRequest(requestId: String!): FriendRequest
    removeFriend(googleId: String!): Boolean
  }


type FUser {
    googleId: String!
    displayName: String
    email: String
    avatar: String
}

  type Query {
    friendRequests: [FriendRequest]!
    friends: [FUser]!
  }
`;
