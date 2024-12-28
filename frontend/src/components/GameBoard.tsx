import React from 'react';
import Cross from './CssComponents/Cross';
import useDummyChecked from '@/hooks/useDummyChecked';
import useLineData from '@/hooks/useLineData';

const dummyData = [
  { boxName: "a", boxValue: "6" },
  { boxName: "b", boxValue: "13" },
  { boxName: "c", boxValue: "9" },
  { boxName: "d", boxValue: "7" },
  { boxName: "e", boxValue: "2" },
  { boxName: "f", boxValue: "17" },
  { boxName: "g", boxValue: "3" },
  { boxName: "h", boxValue: "21" },
  { boxName: "i", boxValue: "10" },
  { boxName: "j", boxValue: "16" },
  { boxName: "k", boxValue: "20" },
  { boxName: "l", boxValue: "8" },
  { boxName: "m", boxValue: "1" },
  { boxName: "n", boxValue: "4" },
  { boxName: "o", boxValue: "5" },
  { boxName: "p", boxValue: "24" },
  { boxName: "q", boxValue: "12" },
  { boxName: "r", boxValue: "11" },
  { boxName: "s", boxValue: "22" },
  { boxName: "t", boxValue: "15" },
  { boxName: "u", boxValue: "19" },
  { boxName: "v", boxValue: "18" },
  { boxName: "w", boxValue: "23" },
  { boxName: "x", boxValue: "25" },
  { boxName: "y", boxValue: "14" }
];

function GameBoard() {
  const { data, setData } = useDummyChecked();
  const { lineData } = useLineData();

  const handleAddCheck = (e: React.MouseEvent<HTMLDivElement>) => {
    const boxName = e.currentTarget.dataset.boxName;

    if (boxName && !data.includes(boxName)) {
      setData((prev) => [...prev, boxName]);
    }
  };

  return (
    <div className="w-full border border-[#535151] bg-[#0c0c0c] rounded-xl grid grid-cols-5 gap-1 p-2 max-w-md min-h-80">
      {dummyData.map((box) => {
        const isChecked = data.includes(box.boxName);
        const isInLineData =
          lineData && lineData.some((line) => line.includes(box.boxName));

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