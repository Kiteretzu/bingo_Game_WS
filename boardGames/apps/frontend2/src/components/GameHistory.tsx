"use client";

import { Clock, Star, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

type GameResult = {
  id: number;
  outcome: "Win" | "Loss";
  ranked: boolean;
  duration: string;
  mmrChange: number;
  date: string;
};

const gameResults: GameResult[] = [
  {
    id: 1,
    outcome: "Win",
    ranked: true,
    duration: "25:13",
    mmrChange: 25,
    date: "2025-01-23",
  },
  {
    id: 2,
    outcome: "Loss",
    ranked: true,
    duration: "31:45",
    mmrChange: -20,
    date: "2025-01-22",
  },
  {
    id: 3,
    outcome: "Win",
    ranked: false,
    duration: "18:22",
    mmrChange: 0,
    date: "2025-01-21",
  },
  {
    id: 4,
    outcome: "Win",
    ranked: true,
    duration: "28:57",
    mmrChange: 22,
    date: "2025-01-20",
  },
  {
    id: 5,
    outcome: "Loss",
    ranked: true,
    duration: "35:10",
    mmrChange: -18,
    date: "2025-01-19",
  },
];

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
