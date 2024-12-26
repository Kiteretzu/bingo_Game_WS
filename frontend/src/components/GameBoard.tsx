import React from 'react';

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
  return (
    <div className="w-full border max-w-md min-h-80">
      {dummyData.map((box) => (
        <div key={box.boxName} className="box">
          <p>{`${box.boxName}: ${box.boxValue}`}</p> {/* Display box name and value */}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;