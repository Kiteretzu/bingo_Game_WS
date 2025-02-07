"use client";

import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import useBingo from "@/hooks/useBingo";

type GameResult = {
  id: string;
  outcome: "Win" | "Loss" | "Unscored";
  ranked: boolean;
  duration: string;
  mmrChange: number;
  date: string;
  startTime: string;
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
    <motion.div className="flex items-center">
      {game.outcome === "Win" ? (
        <TrendingUp className="text-green-500 mr-2" />
      ) : game.outcome === "Loss" ? (
        <TrendingDown className="text-red-500 mr-2" />
      ) : (
        <Clock className="text-gray-400 mr-2" />
      )}
      <span
        className={`font-semibold ${game.outcome === "Win"
            ? "text-green-500"
            : game.outcome === "Loss"
              ? "text-red-500"
              : "text-gray-400"
          }`}
      >
        {game.outcome}
      </span>
    </motion.div>
    <div className="text-gray-400 text-sm xl:font-semibold xl:text-lg">
      {new Date(game.date).toLocaleDateString()}
    </div>
    <div className="text-gray-400 text-sm xl:font-semibold xl:text-lg">
      {new Date(game.startTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    </div>
    <motion.div className="flex items-center">
      <Clock className="text-blue-400 mr-2" />
      <span className="text-gray-300">{game.duration}</span>
    </motion.div>
    {game.outcome !== "Unscored" && (
      <motion.div className="flex items-center">
        <span
          className={`font-semibold ${game.mmrChange > 0 ? "text-green-500" : "text-red-500"
            }`}
        >
          {game.mmrChange > 0 ? "+" : ""}
          {game.mmrChange} MMR
        </span>
      </motion.div>
    )}
  </motion.div>
);

export default function GameHistory() {
  const { bingoProfileId, gameHistory } = useBingo();

  const gameResults: GameResult[] =
    gameHistory?.map((game: any) => {
      if (game.gameEndedAt === "NAN" || game.gameWinnerId === "NAN") {
        return {
          id: game.gameId,
          outcome: "Unscored",
          ranked: false,
          duration: "In Progress",
          mmrChange: 0,
          date: new Date(parseInt(game.createdAt)).toISOString(),
          startTime: new Date(parseInt(game.createdAt)).toISOString(),
        };
      }

      const isWin = game.gameWinnerId === bingoProfileId;
      const duration = Math.floor(
        (parseInt(game.gameEndedAt) - parseInt(game.createdAt)) / 1000
      );
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const durationString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      return {
        id: game.gameId,
        outcome: isWin ? "Win" : "Loss",
        ranked: true,
        duration: durationString,
        mmrChange: isWin ? game.winMMR : -game.loserMMR,
        date: new Date(parseInt(game.createdAt)).toISOString(),
        startTime: new Date(parseInt(game.createdAt)).toISOString(),
      };
    }) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 border w-full h-full border-gray-500/25 p-6 rounded-lg shadow-lg flex flex-col"
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
        className="flex-grow overflow-y-auto overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {gameResults.length === 0 ? (
          <p className="text-gray-400 text-center">No game history available.</p>
        ) : (
          gameResults.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}