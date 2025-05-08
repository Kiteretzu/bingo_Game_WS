import { useEffect, useState } from "react";
import { UserPlus, Swords, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useBingo from "@/hooks/useBingo";
import ChallengeModal from "./dialog/challengedFriend-dialog";
import AddFriendDialog from "./dialog/add-friend-dialog";
import GameChallengeDialog from "./dialog/challangeReceived-dialog";
import PendingRequestsSection from "./PendingFriendReqSection";
import { useGetFriendsQuery } from "@repo/graphql/types/client";
import { RemoveFriendDialog } from "./dialog/removeFriend-dialog";

interface Friend {
  googleId: string;
  displayName: string;
  status: "online" | "offline";
  avatar?: string;
}

interface FriendSectionProps {
  title: string;
  friends: Friend[];
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  isOnline: boolean;
  loading: boolean;
  onChallenge: (friendId: string) => void;
}

const FriendSection = ({
  title,
  friends,
  isExpanded,
  setIsExpanded,
  isOnline,
  loading,
  onChallenge,
}: FriendSectionProps) => (
  <div className="mb-6">
    <div
      className="flex items-center justify-between cursor-pointer mb-2 group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        <Badge
          variant="secondary"
          className={`${
            isOnline
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-500/20 text-gray-400"
          } hover:bg-opacity-30 transition-colors duration-200`}
        >
          {friends.length}
        </Badge>
      </div>
      <ChevronDown
        className={`text-gray-400 group-hover:text-gray-200 transition-transform duration-300 ease-in-out ${
          isExpanded ? "transform rotate-180" : ""
        }`}
        size={20}
      />
    </div>

    <div
      className={`transform transition-all duration-300 ease-in-out origin-top ${
        isExpanded ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 h-0"
      }`}
    >
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.googleId}
              className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-3 rounded-md group 
              transition-all duration-200 transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline
                      ? "bg-green-500 shadow-sm shadow-green-500/50"
                      : "bg-gray-500"
                  }`}
                />
                {friend.avatar && (
                  <img
                    src={friend.avatar}
                    alt={`${friend.displayName}'s avatar`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span
                  className={`${isOnline ? "text-gray-100" : "text-gray-400"} font-medium`}
                >
                  {friend.displayName}
                </span>
              </div>

              <div className="flex space-x-3">
                <RemoveFriendDialog friendId={friend.googleId} />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!isOnline}
                  onClick={() => onChallenge(friend.googleId)}
                  className={`${
                    isOnline
                      ? "text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110"
                      : "text-gray-500 opacity-0 group-hover:opacity-100 cursor-not-allowed"
                  }`}
                >
                  <Swords size={20} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default function FriendList() {
  const [isOnlineExpanded, setIsOnlineExpanded] = useState(true);
  const [isOfflineExpanded, setIsOfflineExpanded] = useState(false);
  const [isChallengeReceived, setIsChallengeReceived] = useState(false);
  const {
    isOpenChallenge,
    setIsOpenChallenge,
    isOpenAddFriend,
    setIsOpenAddFriend,
  } = useBingo();

  const { data, loading } = useGetFriendsQuery({
    variables: {
      googleId: "", // You might want to pass the actual googleId here
    },
  });

  const friends = data?.friends || [];
  // Map FUser (possibly nullable) to Friend
  const mappedFriends: Friend[] = friends
    .filter((f): f is NonNullable<typeof f> => f !== null)
    .map((f) => ({
      googleId: f.googleId,
      displayName: f.displayName ?? "",
      avatar: f.avatar ?? undefined,
      status: "offline", // default or determine actual status if available
    }));

  const onlineFriends = mappedFriends.filter((friend) => friend.status === "online");
  const offlineFriends = mappedFriends.filter((friend) => friend.status === "offline");

useEffect(() => {
  if (data?.friends && data.friends.length > 0) {
    setIsOnlineExpanded(true);
  }
}, [data]);

  const handleChallengePopup = (friendId: string) => {
    setIsOpenChallenge(true);
  };

  return (
    <Card className="w-full h-full bg-gray-800 min-h-full border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-2xl font-bold text-gray-100">
            Friend List
          </CardTitle>
          <AddFriendDialog />
        </div>
      </CardHeader>

      <CardContent className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        <FriendSection
          title="Online"
          friends={onlineFriends}
          isExpanded={isOnlineExpanded}
          setIsExpanded={setIsOnlineExpanded}
          isOnline={true}
          loading={loading}
          onChallenge={handleChallengePopup}
        />
        <FriendSection
          title="Offline"
          friends={offlineFriends}
          isExpanded={isOfflineExpanded}
          setIsExpanded={setIsOfflineExpanded}
          isOnline={false}
          loading={loading}
          onChallenge={handleChallengePopup}
        />
        <PendingRequestsSection />
      </CardContent>

      {isChallengeReceived && (
        <GameChallengeDialog
          challenger="user1"
          onAccept={() => setIsChallengeReceived(false)}
          onDecline={() => setIsChallengeReceived(false)}
        />
      )}

      {/* TODO: Find better way to deel with this */}

      {isOpenChallenge && (
        <ChallengeModal
          friend={
            friends[0]
              ? {
                  id: friends[0].googleId,
                  name: friends[0].displayName ?? "",
                  avatar: friends[0].avatar ?? undefined,
                  status: "offline", // or set real status if available
                }
              : null
          }
        />
      )}
    </Card>
  );
}
