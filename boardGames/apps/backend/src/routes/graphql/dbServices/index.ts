import { client } from "@repo/db/client";
import { BingoProfile, FUser } from "@repo/graphql/types/server";
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
  console.log("this is bingoProfile", bingoProfile);
  return bingoProfile;
};
