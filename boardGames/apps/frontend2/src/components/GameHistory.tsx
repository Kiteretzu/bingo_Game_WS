"use client";

import { Clock, Star, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useGetGameHistoryQuery } from "@repo/graphql/types/client";
import useBingo from "@/hooks/useBingo";

type GameResult = {
  id: string; // Changed to string to match gameId
  outcome: "Win" | "Loss";
  ranked: boolean;
  duration: string;
  mmrChange: number;
  date: string;
  startTime: string; // Added start time
};

const GameCard = ({ game }: { game: GameResult }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className="mb-4 bg-gray-700 rounded-lg cursor-pointer py-4 px-3 xl:p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
  >
    {/* Outcome */}
    <motion.div className="flex items-center">
      {game.outcome === "Win" ? (
        <TrendingUp className="text-green-500 mr-2" />
      ) : (
        <TrendingDown className="text-red-500 mr-2" />
      )}
      <span
        className={`font-semibold ${game.outcome === "Win" ? "text-green-500" : "text-red-500"}`}
      >
        {game.outcome}
      </span>
    </motion.div>
    {/* Date */}
    <div className="text-gray-400 text-sm xl:font-semibold xl:text-lg">
      {new Date(game.date).toLocaleDateString()}
    </div>
    {/* Start Time */}
    <div className="text-gray-400 text-sm xl:font-semibold xl:text-lg">
      {new Date(game.startTime).toLocaleTimeString()}
    </div>
    {/* Duration */}
    <motion.div className="flex items-center">
      <Clock className="text-blue-400 mr-2" />
      <span className="text-gray-300">{game.duration}</span>
    </motion.div>
    {/* MMR Change */}
    <motion.div className="flex items-center">
      <span
        className={`font-semibold ${game.mmrChange > 0 ? "text-green-500" : "text-red-500"}`}
      >
        {game.mmrChange > 0 ? "+" : ""}
        {game.mmrChange} MMR
      </span>
    </motion.div>
  </motion.div>
);

export default function GameHistory() {
  const { data, loading,  } = useGetGameHistoryQuery({
    fetchPolicy: "network-only", // Always fetch fresh data
    notifyOnNetworkStatusChange: true, // Update UI when fetching
  });
  const { bingoProfileId } = useBingo()

  // Transform the incoming data into the GameResult format
  const gameResults: GameResult[] = data?.gameHistory?.map((game: any) => {
    const isWin = game.gameWinnerId === bingoProfileId // Replace with the actual user ID
    const duration = Math.floor((parseInt(game.gameEndedAt) - parseInt(game.createdAt)) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return {
      id: game.gameId,
      outcome: isWin ? "Win" : "Loss",
      ranked: true, // Assuming all games are ranked
      duration: durationString,
      mmrChange: isWin ? game.winMMR : -game.loserMMR,
      date: new Date(parseInt(game.createdAt)).toISOString(),
      startTime: new Date(parseInt(game.createdAt)).toISOString(), // Added start time
    };
  }) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 border w-full h-full border-gray-500/25 p-6 rounded-lg shadow-lg  flex flex-col"
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold mb-6 text-gray-100"
      >
        Game History
      </motion.h2>

      <motion.div
        className="flex-grow overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {gameResults.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}