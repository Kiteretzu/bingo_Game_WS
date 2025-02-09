import React from 'react';
import { Trophy, Medal, Award, WavesLadderIcon, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetLeaderboardPlayersQuery } from '@repo/graphql/types/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { test_LeaderboardData } from '@/dummyTests/testLeaderBoard';

const animate = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Leaderboard() {
  const { data, loading } = useGetLeaderboardPlayersQuery({
    variables: { limit: 10 }
  });

  console.log('people', data?.leaderboard[0].id)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={24} />;
      case 2: return <Medal className="text-gray-300" size={24} />;
      case 3: return <Award className="text-amber-700" size={24} />;
      default: return <Shield className="text-blue-400 opacity-50" size={20} />;
    }
  };

  const getRowColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500/10';
      case 2: return 'bg-gray-300/10';
      case 3: return 'bg-amber-700/10';
      default: return 'hover:bg-gray-700/30';
    }
  };

  if (loading) return (
    <Card className="bg-gray-800 w-full h-full border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">
          <WavesLadderIcon className="inline mr-2 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 mb-4">
            <Skeleton className="h-12 w-full bg-gray-700" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-gray-800/95 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center gap-2">
          <WavesLadderIcon className="text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animate}
          className="divide-y divide-gray-700"
        >
          {data?.leaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              className={`flex items-center p-4 ${getRowColor(player.rank)} transition-colors duration-200`}
              variants={animate}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {getRankIcon(player.rank)}
                </motion.div>
              </div>

              <div className="flex-1 ml-4">
                <div className="font-semibold text-gray-200">
                  {player.displayName}
                </div>
                <div className="text-sm text-gray-400">
                  Rank #{player.rank}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-lg font-bold text-gray-200">
                  {player.mmr.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">MMR</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}