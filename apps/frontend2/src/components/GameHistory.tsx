import { Clock, TrendingUp, TrendingDown, LogIn, Loader } from "lucide-react";
import { motion } from "framer-motion";
import useBingo from "@/hooks/useBingo";
import { useGetGameHistoryQuery } from "@repo/graphql/types/client";

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
    <div className="flex flex-col">
      <motion.div className="flex items-center">
        {game.outcome === "Win" ? (
          <TrendingUp className="text-green-500 mr-2" />
        ) : game.outcome === "Loss" ? (
          <TrendingDown className="text-red-500 mr-2" />
        ) : (
          <Clock className="text-gray-400 mr-2" />
        )}
        <span
          className={`font-semibold ${
            game.outcome === "Win"
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
          className={`font-semibold ${
            game.mmrChange > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {game.mmrChange > 0 ? "+" : ""}
          {game.mmrChange} MMR
        </span>
      </motion.div>
    )}
  </motion.div>
);

const AuthOverlay = () => (
  <div className="absolute inset-0 bg-black/35 backdrop-blur-lg flex flex-col items-center justify-center z-10 rounded-lg">
    <LogIn className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-200 mb-2">Login Required</h3>
    <p className="text-gray-400 text-center max-w-md px-4">
      Please login to view your game history and track your progress.
    </p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <Clock className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-200 mb-2">No Games Yet</h3>
    <p className="text-gray-400 text-center max-w-md px-4">
      Start playing to build your game history and track your progress.
    </p>
  </div>
);

export default function GameHistory() {
  const { bingoProfileId, isAuth } = useBingo();

  // Dummy data for when the user is not authenticated
  const dummyGameResults: GameResult[] = [
    {
      id: "1",
      outcome: "Win",
      ranked: true,
      duration: "5:30",
      mmrChange: 25,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
    },
    {
      id: "2",
      outcome: "Loss",
      ranked: true,
      duration: "4:45",
      mmrChange: -15,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
    },
    {
      id: "3",
      outcome: "Unscored",
      ranked: false,
      duration: "In Progress",
      mmrChange: 0,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
    },
    {
      id: "4",
      outcome: "Win",
      ranked: true,
      duration: "6:10",
      mmrChange: 30,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
    },
    {
      id: "5",
      outcome: "Loss",
      ranked: false,
      duration: "3:50",
      mmrChange: 0,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
    },
    {
      id: "6",
      outcome: "Loss",
      ranked: true,
      duration: "5:00",
      mmrChange: 0,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
    },
    {
      id: "7",
      outcome: "Win",
      ranked: false,
      duration: "7:20",
      mmrChange: 10,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
    },
  ];

  const { data: gameHistory, loading } = useGetGameHistoryQuery({
    variables: {
      bingoProfileId: bingoProfileId,
      limit: 10,
    },
    skip: !isAuth,
    fetchPolicy: "cache-and-network",
  });

  const gameResults: GameResult[] =
    gameHistory?.gameHistory.map((game: any) => {
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
      className="bg-gray-800 border w-full h-full border-gray-500/25 p-4 py-3 rounded-lg shadow-lg flex flex-col relative"
    >
      {!isAuth && <AuthOverlay />}

      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold mb-6 text-gray-100"
      >
        Game History
      </motion.h2>

      <motion.div
        className="flex-grow overflow-y-auto  overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ filter: !isAuth ? "blur(4px) brightness(0.5)" : "none" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin w-8 h-8 text-gray-400" />
          </div>
        ) : isAuth && gameResults.length === 0 ? (
          <EmptyState />
        ) : (
          (isAuth ? gameResults : dummyGameResults).map((game, index) => (
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
