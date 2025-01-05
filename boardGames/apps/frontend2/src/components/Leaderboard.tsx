import { Trophy, Medal, Award } from 'lucide-react'

type Player = {
  rank: number;
  name: string;
  score: number;
}

const players: Player[] = [
  { rank: 1, name: "Alex", score: 2500 },
  { rank: 2, name: "Sam", score: 2400 },
  { rank: 3, name: "Jordan", score: 2350 },
  { rank: 4, name: "Taylor", score: 2300 },
  { rank: 5, name: "Casey", score: 2250 },
  { rank: 6, name: "Riley", score: 2200 },
  { rank: 7, name: "Jamie", score: 2150 },
  { rank: 8, name: "Avery", score: 2100 },
  { rank: 9, name: "Morgan", score: 2050 },
  { rank: 10, name: "Drew", score: 2000 },
];

export default function Leaderboard() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-100 flex items-center">
        <Trophy className="mr-2 text-yellow-500" />
        Leaderboard
      </h2>

      <div className="flex-grow overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="pb-4 font-semibold">Rank</th>
              <th className="pb-4 font-semibold">Name</th>
              <th className="pb-4 font-semibold text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.rank} className="border-t border-gray-700">
                <td className="py-2 flex items-center">
                  {player.rank === 1 && <Trophy className="mr-2 text-yellow-500" size={20} />}
                  {player.rank === 2 && <Medal className="mr-2 text-gray-400" size={20} />}
                  {player.rank === 3 && <Award className="mr-2 text-yellow-700" size={20} />}
                  {player.rank > 3 && <span className="w-5 mr-2 text-gray-500">{player.rank}</span>}
                  <span className="text-gray-300">{player.name}</span>
                </td>
                <td className="py-2 text-gray-300">{player.name}</td>
                <td className="py-2 text-right text-gray-300">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
