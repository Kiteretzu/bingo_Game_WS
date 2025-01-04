import React, { useEffect, useState } from 'react';
import Cross from './CssComponents/Cross';
// import useDummyChecked from '@/hooks/useDummyChecked';
// import useLineData from '@/hooks/useLineData';
import useBingo from '@/hooks/useBingo';
import { Box, BoxesName, BoxesValue, PUT_CHECK_MARK } from '@repo/games/client/bingo/messages';
import { useAppSelector } from '@/store/hooks';


function GameBoard({ socket }: { socket: WebSocket }) {

  const { addCheck } = useBingo()

  const checkedBoxes = useAppSelector(state => state.bingo.checks.checkedBoxes)
  const gameBoard = useAppSelector(state => state.bingo.game.gameBoard)
  const checkedLines = useAppSelector(state => state.bingo.checks.checkedLines)
  console.log({ checkedBoxes })
  console.log({ checkedLines })

  const handleAddCheck = (e: React.MouseEvent<HTMLDivElement>) => {
    const boxValue = e.currentTarget.dataset.boxValue;
    if (!boxValue) throw new Error("Invalid Box Value thrown")
    addCheck(boxValue as BoxesValue)
  };

  if (!gameBoard) return null

  return (
    <div className="w-full border border-[#535151] bg-[#0c0c0c] rounded-xl grid grid-cols-5 gap-1 p-2 max-w-md min-h-80">
      {gameBoard.map((box: Box) => {
        const isChecked = checkedBoxes?.includes(box.boxName);
        console.log('isChecked', isChecked)
        const isInLineData =
          checkedLines && checkedLines.some((line: BoxesName[]) => line.includes(box.boxName));

        return (
          <div
            key={box.boxName}
            data-box-value={box.boxValue}
            data-box-name={box.boxName}
            onClick={isChecked ? undefined : handleAddCheck}
            className={`rounded-lg h-[88px] text-2xl font-bold border flex items-center justify-center relative ${isChecked
              ? isInLineData
                ? "bg-green-100/80 cursor-not-allowed text-black"
                : "bg-red-100/80 cursor-not-allowed text-black"
              : "bg-yellow-300 hover:bg-yellow-400/80 hover:scale-105 cursor-pointer duration-200 text-black"
              }`}
          >
            {isChecked && !isInLineData && <Cross />}
            {box.boxValue}
          </div>
        );
      })}
    </div>
  );
}

export default GameBoard;