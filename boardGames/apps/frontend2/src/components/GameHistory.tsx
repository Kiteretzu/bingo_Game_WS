import { Clock, Star, TrendingUp, TrendingDown } from 'lucide-react'

type GameResult = {
  id: number;
  outcome: 'Win' | 'Loss';
  ranked: boolean;
  duration: string;
  mmrChange: number;
}

const gameResults: GameResult[] = [
  { id: 1, outcome: 'Win', ranked: true, duration: '25:13', mmrChange: 25 },
  { id: 2, outcome: 'Loss', ranked: true, duration: '31:45', mmrChange: -20 },
  { id: 3, outcome: 'Win', ranked: false, duration: '18:22', mmrChange: 0 },
  { id: 4, outcome: 'Win', ranked: true, duration: '28:57', mmrChange: 22 },
  { id: 5, outcome: 'Loss', ranked: true, duration: '35:10', mmrChange: -18 },
];

export default function GameHistory() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Game History</h2>

      <div className="flex-grow overflow-auto">
        {gameResults.map((game) => (
          <div key={game.id} className="mb-4 bg-gray-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              {game.outcome === 'Win' ? (
                <TrendingUp className="text-green-500 mr-2" />
              ) : (
                <TrendingDown className="text-red-500 mr-2" />
              )}
              <span className={`font-semibold ${game.outcome === 'Win' ? 'text-green-500' : 'text-red-500'}`}>
                {game.outcome}
              </span>
            </div>
            <div className="flex items-center">
              {game.ranked && <Star className="text-yellow-500 mr-2" />}
              <span className="text-gray-300 mr-4">{game.ranked ? 'Ranked' : 'Unranked'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-blue-400 mr-2" />
              <span className="text-gray-300">{game.duration}</span>
            </div>
            <div className="flex items-center">
              <span className={`font-semibold ${game.mmrChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {game.mmrChange > 0 ? '+' : ''}{game.mmrChange} MMR
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

