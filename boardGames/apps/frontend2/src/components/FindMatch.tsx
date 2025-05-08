import React, { useState, useRef, useEffect } from "react";
import FindMatchButton from "./buttons/FindMatchButton";
import useBingo from "@/hooks/useBingo";
import { ChevronDown } from "lucide-react";
import ReconnectMatchButton from "./buttons/ReconnectButton";
import ConfirmingMatch from "./ConfirmingMatch";

const GameModeCard = ({ mode, description, selected, onClick }) => (
  <div
    className={`p-4 rounded-lg cursor-pointer transition-all ${selected ? "bg-blue-900 border-2 border-blue-500" : "bg-gray-800 border border-gray-700 hover:border-blue-500"}`}
    onClick={onClick}
  >
    <img
      src="/api/placeholder/200/150"
      alt={`${mode} game mode`}
      className="w-full h-32 object-cover rounded-md mb-3 bg-gray-700"
    />
    <h3
      className={`font-semibold text-lg mb-2 ${selected ? "text-blue-300" : "text-gray-200"}`}
    >
      {mode}
    </h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const GameModeDropdown = ({
  selectedMode,
  setSelectedMode,
  gameModes,
  showModes,
  setShowModes,
}) => {
  const dropdownRef = useRef(null);

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

const FindMatch = () => {
  const {
    findMatch,
    cancelFindMatch,
    isFinding,
    isReconnectGame,
    isMatchFound,
  } = useBingo();
  const [showModes, setShowModes] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Classic");
  const [selectedTier, setSelectedTier] = useState("TIER F");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const gameModes = [
    {
      mode: "Classic",
      description:
        "Traditional bingo gameplay with standard rules and patterns.",
    },
    {
      mode: "Speed Run",
      description:
        "Fast-paced matches with shorter time limits and quick patterns.",
    },
    {
      mode: "Power Up",
      description: "Special power-ups and boosters to enhance your gameplay.",
    },
    {
      mode: "Tournament",
      description: "Compete in bracketed tournaments for greater rewards.",
    },
  ];

  const handleFindMatch = () => {
    findMatch(selectedMode, selectedTier);
  };

  return (
    <div className="flex flex-col w-full md:min-w-[300px] items-center justify-center gap-3 py-2 px-3 md:px-5 relative border border-gray-500/25 bg-gray-800 rounded-xl">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
        <div className="w-full md:w-40 flex-none hidden md:block">
          <GameModeDropdown
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            gameModes={gameModes}
            showModes={showModes}
            setShowModes={setShowModes}
          />
        </div>
        <div className="w-full md:w-auto flex-none">
          {isMatchFound ? (
            <ConfirmingMatch />
          ) : isReconnectGame ? (
            <ReconnectMatchButton />
          ) : (
            <FindMatchButton
              findMatch={handleFindMatch}
              cancelFindMatch={cancelFindMatch}
              isFinding={isFinding}
            />
          )}
        </div>
        <div className="w-full md:w-40 flex-none hidden md:block">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDialogOpen(!isDialogOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium">{selectedTier}</span>
              <ChevronDown
                className={`transform transition-transform ${isDialogOpen ? "rotate-180" : ""}`}
                size={16}
              />
            </button>
            {isDialogOpen && (
              <div className="absolute bottom-full mb-2 z-10 right-0 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                {[
                  "TIER A",
                  "TIER B",
                  "TIER C",
                  "TIER D",
                  "TIER E",
                  "TIER F",
                ].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier);
                      setIsDialogOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${
                      selectedTier === tier
                        ? "bg-blue-900 text-blue-300"
                        : "text-gray-200 hover:bg-gray-800"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-only controls */}
      <div className="flex w-full gap-3 md:hidden">
        <div className="w-1/2 flex-none">
          <GameModeDropdown
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            gameModes={gameModes}
            showModes={showModes}
            setShowModes={setShowModes}
          />
        </div>
        <div className="w-1/2 flex-none">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDialogOpen(!isDialogOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium">{selectedTier}</span>
              <ChevronDown
                className={`transform transition-transform ${isDialogOpen ? "rotate-180" : ""}`}
                size={16}
              />
            </button>
            {isDialogOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                {[
                  "TIER A",
                  "TIER B",
                  "TIER C",
                  "TIER D",
                  "TIER E",
                  "TIER F",
                ].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier);
                      setIsDialogOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${
                      selectedTier === tier
                        ? "bg-blue-900 text-blue-300"
                        : "text-gray-200 hover:bg-gray-800"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMatch;
