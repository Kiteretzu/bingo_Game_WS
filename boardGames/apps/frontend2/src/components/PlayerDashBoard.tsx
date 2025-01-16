'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronUp, ChevronDown, Swords, CoinsIcon, ArrowRightLeft } from 'lucide-react'

interface Move {
  moveCount: number
  value: string
  change: number
  player: 'Player 1' | 'Player 2'
}

const dummyData: Move[] = [
  { moveCount: 1, value: "21", change: 5, player: 'Player 1' },
  { moveCount: 2, value: "34", change: -2, player: 'Player 2' },
  { moveCount: 3, value: "50", change: 8, player: 'Player 1' },
  { moveCount: 4, value: "12", change: -10, player: 'Player 2' },
  { moveCount: 5, value: "67", change: 15, player: 'Player 1' },
]

interface PlayerDashBoardProps {
  player1: string
  player2: string
  tossWinner: 'Player 1' | 'Player 2'
  firstPlayer: 'Player 1' | 'Player 2'
}

function PlayerDashBoard({ player1, player2, tossWinner, firstPlayer }: PlayerDashBoardProps) {
  const getChangeColor = ({ change }: { change: number }) => {
    return change > 0 ? 'text-green-400' : 'text-red-400';
  }

  const getChangeIcon = (change: number) => {
    return change > 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const playerMoves = (player: 'Player 1' | 'Player 2') => {
    return dummyData.filter(move => move.player === player)
  }

  return (
    <Card className="w-full bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className=" p-0">
        <CardTitle className="flex flex-col py-3 justify-center items-center  border-b border-gray-700">
          <div className="text-2xl font-bold text-center text-amber-400 flex items-center justify-center space-x-2">
            <span>{player1}</span>
            <Swords className="w-6 h-6" />
            <span>{player2}</span>
          </div>
          <div className="text-sm text-gray-400 flex flex-col items-center">
            <div className="flex items-center mb-1">
              <CoinsIcon className="w-4 h-4 mr-2" />
              Toss won by: {tossWinner === 'Player 1' ? player1 : player2}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex py-3">
          <PlayerColumn player={player1} playerKey="Player 1" moves={playerMoves('Player 1')} />
          <Separator orientation="vertical" className="mx-4" />
          <PlayerColumn player={player2} playerKey="Player 2" moves={playerMoves('Player 2')} />
        </div>
      </CardContent>
    </Card>
  )

  function PlayerColumn({ player, playerKey, moves }: { player: string, playerKey: 'Player 1' | 'Player 2', moves: Move[] }) {
    return (
      <div className="flex-1">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Avatar className="h-16 w-16 border-2 border-amber-400">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${player}`} />
            <AvatarFallback>{player.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-100">{player}</h3>
            <Badge variant="outline" className={playerKey === 'Player 1' ? 'border-blue-400 text-blue-400' : 'border-red-400 text-red-400'}>
              {playerKey}
            </Badge>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {moves.map((move) => (
            <div
              key={move.moveCount}
              className={`flex justify-between items-center p-2 rounded-md ${move.player === 'Player 1' ? 'border-l-4 border-blue-400' : 'border-l-4 border-red-400'} bg-gray-700/50`}
            >
              <span className="text-gray-400">Move {move.moveCount}</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-100">{move.value}</span>
                <span className={`flex items-center ${getChangeColor(move)}`}>
                  {getChangeIcon(move.change)}
                  {Math.abs(move.change)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function CurrentTurnIndicator({ currentPlayer }: { currentPlayer: string }) {
    return (
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-100 mb-2">Current Turn</h4>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {currentPlayer}
        </Badge>
      </div>
    )
  }
}

export default PlayerDashBoard

