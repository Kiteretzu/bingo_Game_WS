import React from 'react'
import Cross from './CssComponents/Cross'
import useBingo from '@/hooks/useBingo'
import { Box, BoxesName, BoxesValue } from '@repo/games/client/bingo/messages'
import { Card, CardContent } from '@/components/ui/card'
import {obj} from '@/hooks/test'

function GameBoard() {
  const { addCheck, checkedBoxes, gameBoard, checkedLines } = useBingo()

  const handleAddCheck = (e: React.MouseEvent<HTMLDivElement>) => {
    const boxValue = e.currentTarget.dataset.boxValue
    if (!boxValue) throw new Error("Invalid Box Value thrown")
    addCheck(boxValue as BoxesValue)
  }

  if (!gameBoard) return null

  return (
    <Card className="bg-gray-800/50 border w-full min-w-[370px] border-red-700">
      <CardContent className="p-0 ">
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {obj.map((box: Box) => {
            const isChecked = checkedBoxes?.includes(box.boxName)
            const isInLineData = checkedLines && checkedLines.some((line: BoxesName[]) => line.includes(box.boxName))

            return (
              <div
                key={box.boxName}
                data-box-value={box.boxValue}
                data-box-name={box.boxName}
                onClick={isChecked ? undefined : handleAddCheck}
                className={`
                  rounded-lg h-20 text-2xl font-bold flex items-center justify-center relative
                  transition-all duration-300 ease-in-out transform hover:scale-105
                  ${isChecked
                    ? isInLineData
                      ? "bg-green-500/80 cursor-not-allowed text-white"
                      : "bg-red-500/80 cursor-not-allowed text-white"
                    : "bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-gray-900"
                  }
                `}
              >
                {isChecked && !isInLineData && <Cross />}
                {box.boxValue}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default GameBoard

