'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { motion } from 'framer-motion'

type Player = {
  rank: number
  name: string
  score: number
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
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function Leaderboard() {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-100 flex items-center"
        variants={itemVariants}
      >
        <Trophy className="mr-2 text-yellow-500" />
        Leaderboard
      </motion.h2>

      <motion.div className="flex-grow overflow-auto" variants={containerVariants}>
        <table className="w-full">
          <thead>
            <motion.tr className="text-gray-400 text-left" variants={itemVariants}>
              <th className="pb-4 font-semibold">Name</th>
              <th className="pb-4 font-semibold">Rank</th>
              <th className="pb-4 font-semibold text-right">MMR</th>
            </motion.tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <motion.tr
                key={player.rank}
                className="border-t border-gray-700"
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <td className="py-2 flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    {player.rank === 1 && <Trophy className="mr-2 text-yellow-500" size={20} />}
                    {player.rank === 2 && <Medal className="mr-2 text-gray-400" size={20} />}
                    {player.rank === 3 && <Award className="mr-2 text-yellow-700" size={20} />}
                    {player.rank > 3 && <span className="w-5 mr-2 text-gray-500">{player.rank}</span>}
                  </motion.div>
                  <span className="text-gray-300">{player.name}</span>
                </td>
                <td className="py-2 text-gray-300">{player.name}</td>
                <td className="py-2 text-right text-gray-300">{player.score}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}

