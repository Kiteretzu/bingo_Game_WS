import React, { useState } from "react";
import { X, Swords, Trophy } from "lucide-react";
import useBingo from "@/hooks/useBingo";

interface Friend {
  id: string;
  name: string;
  status: "online" | "offline";
  avatar?: string;
}

interface ChallengeModalProps {
  friend: Friend | null;
}

const gameTypes = [
  { id: "a", name: "Wage 1000 INR" },
  { id: "b", name: "Wage 500 INR" },
  { id: "c", name: "Wage 250 INR" },
  { id: "d", name: "Wage 125 INR" },
  { id: "e", name: "Wage 50 INR" },
  { id: "f", name: "Friendly Match" },
];

const gameModes = [
  { id: "casual", name: "Casual" },
  { id: "competitive", name: "Competitive" },
  { id: "custom", name: "Custom" },
];

export default function ChallengeModal({ friend }: ChallengeModalProps) {
  const { isOpenChallenge: isOpen, setIsOpenChallenge } = useBingo();
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  const onClose = () => {
    setIsOpenChallenge(false);
    setSelectedGame("");
    setSelectedMode("");
  };

  if (!isOpen || !friend) return null;

  const handleSendChallenge = () => {
    if (!selectedGame || !selectedMode) {
      alert("Please select both game type and mode");
      return;
    }

    console.log("Challenge sent!", {
      friend,
      selectedGame,
      selectedMode,
    });

    // TODO: Emit socket event to send challenge
    // socket.emit('challenge', {
    //   to: friend.id,
    //   gameType: selectedGame,
    //   gameMode: selectedMode
    // });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Challenge Friend</h2>
          </div>

          {/* Selected Friend */}
          <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg mb-6">
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                {friend.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-white font-medium">{friend.name}</h3>
              <p
                className={`text-sm ${friend.status === "online" ? "text-green-500" : "text-gray-400"}`}
              >
                {friend.status}
              </p>
            </div>
          </div>

          {/* Game Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Type
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select game type</option>
                {gameTypes.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game Mode
              </label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select game mode</option>
                {gameModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSendChallenge}
            disabled={!selectedGame || !selectedMode}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Swords className="w-5 h-5" />
            Challenge {friend.name}
          </button>
        </div>
      </div>
    </div>
  );
}
