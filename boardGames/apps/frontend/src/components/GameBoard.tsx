import React, { useEffect } from 'react';
import Cross from './CssComponents/Cross';
// import useDummyChecked from '@/hooks/useDummyChecked';
// import useLineData from '@/hooks/useLineData';
import useGame from '@/hooks/useBingo';
import { ADD_CHECK_MARK } from '@repo/games/client/bingo';

// const dummyData = [
//   { boxName: "a", boxValue: "6" },
//   { boxName: "b", boxValue: "13" },
//   { boxName: "c", boxValue: "9" },
//   { boxName: "d", boxValue: "7" },
//   { boxName: "e", boxValue: "2" },
//   { boxName: "f", boxValue: "17" },
//   { boxName: "g", boxValue: "3" },
//   { boxName: "h", boxValue: "21" },
//   { boxName: "i", boxValue: "10" },
//   { boxName: "j", boxValue: "16" },
//   { boxName: "k", boxValue: "20" },
//   { boxName: "l", boxValue: "8" },
//   { boxName: "m", boxValue: "1" },
//   { boxName: "n", boxValue: "4" },
//   { boxName: "o", boxValue: "5" },
//   { boxName: "p", boxValue: "24" },
//   { boxName: "q", boxValue: "12" },
//   { boxName: "r", boxValue: "11" },
//   { boxName: "s", boxValue: "22" },
//   { boxName: "t", boxValue: "15" },
//   { boxName: "u", boxValue: "19" },
//   { boxName: "v", boxValue: "18" },
//   { boxName: "w", boxValue: "23" },
//   { boxName: "x", boxValue: "25" },
//   { boxName: "y", boxValue: "14" }
// ];

interface Box {
  boxName: string,
  boxValue: string
}

function GameBoard({ socket }: { socket: WebSocket }) {
  // const { data, setData } = useDummyChecked();
  // const { lineData } = useLineData();

  // if (!socket) {return}
  const { gameBoard, checkedBoxes, checkedLines, sendMessage } = useGame()

  useEffect(() => {
    socket.onmessage = (e: MessageEvent) => {
      console.log('thjis is the message ingameboard ', JSON.stringify(e))
    }

  }, [socket])


  console.log('this is gameBoard', gameBoard)

  const handleAddCheck = (e: React.MouseEvent<HTMLDivElement>) => {
    const boxName = e.currentTarget.getAttribute('data-box-name');
    if (boxName) {
      sendMessage(ADD_CHECK_MARK, boxName); // Assuming `addCheckMark` is used to handle clicks
    }
  };

  if (!gameBoard) return null

  return (
    <div className="w-full border border-[#535151] bg-[#0c0c0c] rounded-xl grid grid-cols-5 gap-1 p-2 max-w-md min-h-80">
      {gameBoard.map((box: Box) => {
        const isChecked = checkedBoxes.includes(box.boxName);
        const isInLineData =
          checkedLines && checkedLines.some((line: string[]) => line.includes(box.boxName));

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