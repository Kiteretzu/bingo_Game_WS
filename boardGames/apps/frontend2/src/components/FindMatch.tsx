import React, { useState, useRef, useEffect } from 'react';
import FindMatchButton from './buttons/FindMatchButton';
import useBingo from '@/hooks/useBingo';
import { ChevronDown } from 'lucide-react';
import ReconnectMatchButton from './buttons/ReconnectButton';
import ConfirmingMatch from './ConfirmingMatch';
import TierSelectionDialog from './dialog/tier-selection-dialog';

const GameModeCard = ({ mode, description, selected, onClick }) => (
    <div
        className={`p-4 rounded-lg cursor-pointer transition-all ${selected ? 'bg-blue-900 border-2 border-blue-500' : 'bg-gray-800 border border-gray-700 hover:border-blue-500'}`}
        onClick={onClick}
    >
        <img
            src="/api/placeholder/200/150"
            alt={`${mode} game mode`}
            className="w-full h-32 object-cover rounded-md mb-3 bg-gray-700"
        />
        <h3 className={`font-semibold text-lg mb-2 ${selected ? 'text-blue-300' : 'text-gray-200'}`}>{mode}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </div>
);

const GameModeDropdown = ({ selectedMode, setSelectedMode, gameModes, showModes, setShowModes }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowModes(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowModes]);

    return (
        <div className="w-full max-w-md relative" ref={dropdownRef}>
            {showModes && (
                <div className="absolute bottom-full z-30 mb-2 w-full">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 shadow-xl">
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
                <ChevronDown className={`transform transition-transform ${showModes ? 'rotate-180' : ''}`} size={20} />
            </button>
        </div>
    );
};

const FindMatch = () => {
    const { findMatch, cancelFindMatch, isFinding, isReconnectGame, isMatchFound } = useBingo();
    const [showModes, setShowModes] = useState(false);
    const [selectedMode, setSelectedMode] = useState('Classic');
    const [selectedTier, setSelectedTier] = useState('TIER F');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const gameModes = [
        { mode: 'Classic', description: 'Traditional bingo gameplay with standard rules and patterns.' },
        { mode: 'Speed Run', description: 'Fast-paced matches with shorter time limits and quick patterns.' },
        { mode: 'Power Up', description: 'Special power-ups and boosters to enhance your gameplay.' },
        { mode: 'Tournament', description: 'Compete in bracketed tournaments for greater rewards.' },
    ];

    const handleFindMatch = () => {
        findMatch(selectedMode, selectedTier);
    };

    return (
        <div className={`w-full h-full border border-gray-500/25 bg-gray-800 rounded-xl flex flex-col items-center justify-center gap-3`}>
            <GameModeDropdown
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                gameModes={gameModes}
                showModes={showModes}
                setShowModes={setShowModes}
            />
            <TierSelectionDialog selectedTier={selectedTier} onSelectTier={setSelectedTier} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
            <div className="w-full flex justify-center">
                {isMatchFound ? (
                    <ConfirmingMatch />
                ) : isReconnectGame ? (
                    <ReconnectMatchButton />
                ) : (
                    <FindMatchButton findMatch={handleFindMatch} cancelFindMatch={cancelFindMatch} isFinding={isFinding} />
                )}
            </div>
        </div>
    );
};

export default FindMatch;