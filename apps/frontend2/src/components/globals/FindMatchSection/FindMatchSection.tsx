import { useMatchmaking } from "@/hooks/useMatchmaking";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import FindMatchButton from "../../buttons/FindMatchButton";
import ReconnectMatchButton from "../../buttons/ReconnectButton";
import ConfirmingMatch from "../../ConfirmingMatch";
import GameModeDropdown from "./components/GameModeDropdown";
import { gameModes, tiers } from "./constants";

const FindMatch = () => {
  const {
    findMatch,
    cancelFindMatch,
    isFinding,
    isReconnectGame,
    isMatchFound,
  } = useMatchmaking();
  const [showModes, setShowModes] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Classic");
  const [selectedTier, setSelectedTier] = useState("TIER F");
  const [isDialogOpen, setIsDialogOpen] = useState(false);



  const handleFindMatch = () => {
    findMatch();
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
                {tiers.map((tier) => (
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
                {tiers.map((tier) => (
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
