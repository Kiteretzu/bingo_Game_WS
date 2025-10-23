import { ChevronDown } from "lucide-react";
import GameModeCard from "./GameModeCard";

const GameModeDropdown = ({
  selectedMode,
  setSelectedMode,
  gameModes,
  showModes,
  setShowModes,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowModes]);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {showModes && (
        <div className="absolute bottom-full mb-2 w-full">
          <div className="grid grid-cols-2 gap-4 relative p-4 min-w-96 bg-gray-900 rounded-lg border border-gray-700 shadow-xl">
            {gameModes.map((gameMode) => (
              <GameModeCard
                key={gameMode.mode}
                {...gameMode}
                selected={selectedMode === gameMode.mode}
                onClick={() => {
                  setSelectedMode(gameMode.mode);
                  setShowModes(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setShowModes(!showModes)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:bg-gray-700 transition-colors text-gray-200"
      >
        <span className="font-medium">{selectedMode} Mode</span>
        <ChevronDown
          className={`transform transition-transform ${showModes ? "rotate-180" : ""}`}
          size={20}
        />
      </button>
    </div>
  );
};
function useRef<T>(arg0: null) {
    throw new Error("Function not implemented.");
}

function useEffect(arg0: () => () => void, arg1: any[]) {
    throw new Error("Function not implemented.");
}


export default GameModeDropdown;