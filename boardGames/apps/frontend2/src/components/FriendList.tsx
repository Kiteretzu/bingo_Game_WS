"use client";
import { useState } from "react";
import { UserPlus, Swords, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useBingo from "@/hooks/useBingo";
import ChallengeModal from "./ChallengeFriend";
import AddFriendPopup from "./AddFriend";

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

  const [isOnlineExpanded, setIsOnlineExpanded] = useState(true);
  const [isOfflineExpanded, setIsOfflineExpanded] = useState(true);

  const onlineFriends = friends.filter((friend) => friend.status === "online");
  const offlineFriends = friends.filter(
    (friend) => friend.status === "offline"
  );

  const handleAddFriendPopup = () => setIsOpenAddFriend(true);

  const handleChallengePopup = (friendId: string) => setIsOpenChallenge(true);


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
        <div className=" mb-6">
            <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
                    <span className="text-sm text-gray-400">({friends.length})</span>
                </div>
                <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""
                        }`}
                    size={20}
                />
            </div>

            <div
                className={`transition-all duration-200 overflow-hidden ${isExpanded ? "max-h-96" : "max-h-0"
                    }`}
            >
                <ul className="space-y-2">
                    {friends.map((friend) => (
                        <li
                            key={friend.id}
                            className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 p-3 rounded-md group transition-all duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${isOnline ? "bg-yellow-500" : "bg-gray-500"
                                        }`}
                                />
                                <span
                                    className={`${isOnline ? "text-gray-100" : "text-gray-400"}`}
                                >
                                    {friend.name}
                                </span>
                            </div>
                            <Swords
                                className={`${isOnline
                                        ? "text-yellow-500 opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110"
                                        : "text-gray-500 opacity-0 group-hover:opacity-100 cursor-not-allowed"
                                    } transition-all duration-200`}
                                size={20}
                                onClick={
                                    isOnline ? () => handleChallengePopup(friend.id) : undefined
                                }
                            />

                            {isOpenChallenge && (
                                <div className="z-10">
                                    {" "}
                                    <ChallengeModal friend={friend} />
                                </div>
                            )}
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
            className="w-auto bg-blue-500/85 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            <UserPlus className="mr-2" size={20} />
            Add Friend
          </Button>
        </div>
        {isOpenAddFriend && (
          <div className="z-10">
            <AddFriendPopup />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <FriendSection
          title="Online Friends"
          friends={onlineFriends}
          isExpanded={isOnlineExpanded}
          setIsExpanded={setIsOnlineExpanded}
          isOnline={true}
        />

        <FriendSection
          title="Offline Friends"
          friends={offlineFriends}
          isExpanded={isOfflineExpanded}
          setIsExpanded={setIsOfflineExpanded}
          isOnline={false}
        />
      </CardContent>
    </Card>
  );
}

