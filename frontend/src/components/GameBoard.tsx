import React from 'react';
import ResignButton from './buttons/ResignButton';
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
  const { lineData, setLineData } = useLineData()

  const handleAddCheck = (e: React.MouseEvent<HTMLDivElement>) => {
    const boxValue = e.currentTarget.dataset.boxValue; // Retrieve the boxValue
    const boxName = e.currentTarget.dataset.boxName; // Retrieve the boxName

    console.log("Box Value:", boxValue, "and Box Name:", boxName);

    if (boxName) {
      setData((prev) => [...prev, boxName]); // Add boxName to the state
    }
  };

  return (
    <div className="w-full border border-[#535151] bg-[#0c0c0c] rounded-xl grid grid-cols-5 gap-1 p-2 max-w-md min-h-80">
      {dummyData.map((box) => (
        data.includes(box.boxName) ? lineData ? (
          <>
            {lineData.map((each) => (
              <div
                key={box.boxName}
                data-box-value={box.boxValue}
                data-box-name={box.boxName}
                onClick={handleAddCheck}
                className="bg-green-600 rounded-lg cursor-not-allowed h-[88px] text-2xl text-black  border-slate-950 font-bold border flex items-center justify-center relative"
              >
                <Cross />
                {box.boxValue} {/* Display box value */}
              </div>
            ))}
          </>
        ) : (<div
          key={box.boxName}
          data-box-value={box.boxValue}
          data-box-name={box.boxName}
          onClick={handleAddCheck}
          className="bg-red-100/80 rounded-lg cursor-not-allowed h-[88px] text-2xl text-black  border-slate-950 font-bold border flex items-center justify-center relative"
        >
          <Cross />
          {box.boxValue} {/* Display box value */}
        </div>)

          : (
            <div
              key={box.boxName}
              data-box-value={box.boxValue}
              data-box-name={box.boxName}
              onClick={handleAddCheck}
              className="bg-yellow-300 rounded-lg hover:bg-yellow-400/80 cursor-pointer h-[88px] hover:scale-105 text-2xl duration-200 border-slate-950 text-black font-bold border flex items-center justify-center relative"
            >
              {box.boxValue} {/* Display box value */}
            </div>
          )
      ))
      }
    </div >
  );
}

export default GameBoard;