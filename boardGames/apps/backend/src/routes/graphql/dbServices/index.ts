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
    select: {
      friendshipsAsUser1: {
        select: {
          user2: true,
        },
      },
      friendshipsAsUser2: {
        select: {
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

export const getGameHistoryByBingoProfileId = async (
  bingoProfileId: string,
  limit: number = 10
): Promise<BingoGame[]> => {
  if (!bingoProfileId) {
    throw new GraphQLError("Bingo Profile ID is required");
  }

  const allGames = await client.bingoGameHistory.findMany({
    where: {
      bingoProfileId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit || 10,
    select: {
      game: true,
    },
  });

  const history = allGames.map((game) => game.game);

  return history as unknown as BingoGame[];
};
