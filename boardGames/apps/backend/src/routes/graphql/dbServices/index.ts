import { client } from "@repo/db/client";
import { FUser, BingoProfile, BingoGame } from "@repo/graphql/types/server";
import { GraphQLError } from "graphql";

export const getFriendsByUserId = async (
  userId: string
): Promise<FUser[] | []> => {
  if (!userId) {
    throw new GraphQLError("User ID is required");
  }

  // Implement the logic to fetch friends
  const friends = await client.user.findUnique({
    where: {
      googleId: userId,
    },
    include: {
      friendshipsAsUser1: {
        include: {
          user2: true,
        },
      },
      friendshipsAsUser2: {
        include: {
          user1: true,
        },
      },
    },
  });

  const allFriends = [
    ...(friends?.friendshipsAsUser1?.map((f) => f.user2) || []),
    ...(friends?.friendshipsAsUser2?.map((f) => f.user1) || []),
  ];
  console.log("friends checkup", allFriends);
  return allFriends.map((friend) => ({
    googleId: friend.googleId,
    displayName: friend.displayName,
    email: friend.email,
    avatar: friend.avatar,
  }));
};

export const getBingoProfileByUserId = async (
  userId: string
): Promise<BingoProfile | null> => {
  if (!userId) {
    throw new GraphQLError("User ID is required");
  }
  // Implement the logic to fetch user profile
  const bingoProfile = await client.bingoProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  console.log("Bingo ProfileCheckup");
  return bingoProfile as unknown as BingoProfile;
};

export const getGameHistoryByBingoId = async (
  bingoProfileId: string,
  limit: number = 10
): Promise<BingoGame[] | null> => {
  if (!bingoProfileId) {
    throw new GraphQLError("Bingo Profile ID is required");
  }
  const bingoProfile = await client.bingoProfile.findUnique({
    where: {
      id: bingoProfileId,
    },
    include: {
      gameHistory: {
        include: {
          players: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      },
    },
  });

  if (!bingoProfile) {
    throw new GraphQLError("Bingo Profile not found");
  }

  const gameHistory = bingoProfile?.gameHistory;
  console.log("gameHistory checkup");

  if (!gameHistory) {
    throw new GraphQLError("Game history not found");
  }

  return gameHistory as unknown as BingoGame[];
};
