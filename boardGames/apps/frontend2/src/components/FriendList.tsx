"use client";
import { useEffect, useState } from "react";
import { UserPlus, Swords, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useBingo from "@/hooks/useBingo";
import ChallengeModal from "./dialog/challengedFriend-dialog";
import AddFriendPopup from "./AddFriend";
import GameChallengePopup from "./dialog/challangeReceived-dialog";
import PendingRequestsSection from "./PendingFriendReqSection";
import { useGetFriendsQuery } from "@repo/graphql/types/client";

interface Friend {
  id: string;
  name: string;
  status: "online" | "offline";
}

export default function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: "1", name: "Alice", status: "online" },
    { id: "2", name: "Bob", status: "offline" },
    { id: "3", name: "Charlie", status: "online" },
    { id: "4", name: "David", status: "offline" },
  ]);

  const {
    isOpenChallenge,
    setIsOpenChallenge,
    isOpenAddFriend,
    setIsOpenAddFriend,
  } = useBingo();

  const { data, loading } = useGetFriendsQuery({
    variables: {
      googleId: ""
    }
  });

  const [isOnlineExpanded, setIsOnlineExpanded] = useState(false);
  const [isOfflineExpanded, setIsOfflineExpanded] = useState(false);
  const [isChallengeRecived, SetisChallengeRecived] = useState<boolean>(false);

  const onlineFriends = friends.filter((friend) => friend.status === "online");
  const offlineFriends = friends.filter((friend) => friend.status === "offline");

  const handleAddFriendPopup = () => setIsOpenAddFriend(true);
  const handleChallengePopup = (friendId: string) => setIsOpenChallenge(true);

  useEffect(() => {
    if (!data) return;
    if (data?.friends.length > 0) {
      setIsOnlineExpanded(true);
    }
  }, [data]);

  const FriendSection = ({
    title,
    friends,
    isExpanded,
    setIsExpanded,
    isOnline,
  }: {
    title: string;
    friends: Friend[];
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
    isOnline: boolean;
  }) => (
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
              isOnline ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
            } hover:bg-opacity-30 transition-colors duration-200`}
          >
            {data?.friends.length ?? 0}
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
        <ul className="space-y-2">
          {data?.friends.map((friend) => (
            <li
              key={friend?.googleId}
              className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-3 rounded-md group 
                transition-all duration-200 transform hover:scale-102"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline
                      ? "bg-green-500 shadow-sm shadow-green-500/50"
                      : "bg-gray-500"
                  }`}
                />
                <span
                  className={`${
                    isOnline ? "text-gray-100" : "text-gray-400"
                  } font-medium`}
                >
                  {friend?.displayName}
                </span>
              </div>
              <Swords
                className={`${
                  isOnline
                    ? "text-green-500 opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110 transition-all duration-200"
                    : "text-gray-500 opacity-0 group-hover:opacity-100 cursor-not-allowed"
                }`}
                size={20}
                onClick={
                  isOnline ? () => handleChallengePopup(friend?.googleId!) : undefined
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Card className="w-full h-full bg-gray-800 min-h-full border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-2xl font-bold text-gray-100">
            Friend List
          </CardTitle>
          <Button
            onClick={handleAddFriendPopup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add Friend
          </Button>
        </div>
        {isOpenAddFriend && (
          <div className="z-10">
            <AddFriendPopup />
          </div>
        )}
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        <FriendSection
          title="Online"
          friends={onlineFriends}
          isExpanded={isOnlineExpanded}
          setIsExpanded={setIsOnlineExpanded}
          isOnline={true}
        />
        <FriendSection
          title="Offline"
          friends={offlineFriends}
          isExpanded={isOfflineExpanded}
          setIsExpanded={setIsOfflineExpanded}
          isOnline={false}
        />
        <PendingRequestsSection />
      </CardContent>
      {isChallengeRecived && (
        <GameChallengePopup
          challenger="user1"
          onAccept={() => SetisChallengeRecived(false)}
          onDecline={() => SetisChallengeRecived(false)}
        />
      )}
      {isOpenChallenge && <ChallengeModal friend={friends[0]} />}
    </Card>
  );
}