import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const dummyData = [
  { moveCount: 1, value: "21" },
  { moveCount: 2, value: "34" },
  { moveCount: 3, value: "50" },
  { moveCount: 4, value: "12" },
  { moveCount: 5, value: "67" },
]

interface PlayerDashBoardProps {
  player: string
}

function PlayerDashBoard({ player }: PlayerDashBoardProps) {
  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${player}`} />
            <AvatarFallback>{player[0]}</AvatarFallback>
          </Avatar>
          <span className="text-lg">{player}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {dummyData.map((each) => (
            <div key={each.moveCount} className="flex justify-between">
              <span className="text-gray-400">{each.moveCount})</span>
              <span>{each.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PlayerDashBoard

