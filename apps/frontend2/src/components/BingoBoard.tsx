import React from 'react'
import Cross from './CssComponents/Cross'
import useBingo from '@/hooks/useBingo'
import { Card, CardContent } from '@/components/ui/card'
import { obj } from '@/dummyTests/gameBoard'
import { Box, BoxesName, BoxesValue } from '@repo/messages/message'

function GameBoard() {
  const { addCheck, checkedBoxes, gameBoard, checkedLines } = useBingo()



  const handleAddCheck = (e: React.MouseEvent<HTMLDivElement>) => {
    const boxValue = e.currentTarget.dataset.boxValue
    if (!boxValue) throw new Error("Invalid Box Value thrown")
    addCheck(boxValue as BoxesValue)
  }

  if (!gameBoard) return null

  return (
    <Card className="bg-gray-800/50 shrink-0 border-none w-full min-w-[370px] lg:min-w-[450px] ">
      <CardContent className="p-0">
        <div className="grid grid-cols-5 gap-2  border p-4 rounded-xl border-gray-700 max-w-md mx-auto">
          {gameBoard.map((box: Box) => {
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
                  transition-all duration-300 select-none ease-in-out transform hover:scale-105
                  ${isChecked
                    ? isInLineData
                      ? "bg-green-500/80 cursor-not-allowed text-white"
                      : "bg-red-500/80 cursor-not-allowed text-white"
                    : "bg-[#f6d947] hover:bg-yellow-500 cursor-pointer text-gray-900"
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

