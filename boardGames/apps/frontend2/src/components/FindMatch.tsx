import React, { useState, useRef, useEffect } from 'react';
import FindMatchButton from './buttons/FindMatchButton';
import useBingo from '@/hooks/useBingo';
import { ChevronDown } from 'lucide-react';

const GameModeCard = ({ mode, description, selected, onClick }) => (
    <div
        className={`p-4 rounded-lg cursor-pointer transition-all ${selected ? 'bg-blue-900 border-2 border-blue-500' : 'bg-gray-800 border border-gray-700 hover:border-blue-500'
            }`}
        onClick={onClick}
    >
        <img
            src="/api/placeholder/200/150"
            alt={`${mode} game mode`}
            className="w-full h-32 object-cover rounded-md mb-3 bg-gray-700"
        />
        <h3 className={`font-semibold text-lg mb-2 ${selected ? 'text-blue-300' : 'text-gray-200'}`}>
            {mode}
        </h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </div>
);

const FindMatch = () => {
    const { findMatch, cancelFindMatch, isFinding } = useBingo();
    const [showModes, setShowModes] = useState(false);
    const [selectedMode, setSelectedMode] = useState('Classic');
    const dropdownRef = useRef(null);

    const gameModes = [
        {
            mode: 'Classic',
            description: 'Traditional bingo gameplay with standard rules and patterns.',
        },
        {
            mode: 'Speed Run',
            description: 'Fast-paced matches with shorter time limits and quick patterns.',
        },
        {
            mode: 'Power Up',
            description: 'Special power-ups and boosters to enhance your gameplay.',
        },
        {
            mode: 'Tournament',
            description: 'Compete in bracketed tournaments for greater rewards.',
        }
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowModes(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFindMatch = () => {
        findMatch(selectedMode);
    };

    return (
        <div className="  border border-gray-500/25 bg-gray-800 rounded-xl flex flex-col items-center justify-center gap-3 relative" ref={dropdownRef}>
            {/* Game modes dropdown appearing upwards */}
            <div className="w-full max-w-md relative">
                {showModes && (
                    <div className="absolute bottom-full mb-2 w-full">
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

                {/* Dropdown button */}
                <button
                    onClick={() => setShowModes(!showModes)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:bg-gray-700 transition-colors text-gray-200"
                >
                    <span className="font-medium">{selectedMode} Mode</span>
                    <ChevronDown
                        className={`transform transition-transform ${showModes ? 'rotate-180' : ''}`}
                        size={20}
                    />
                </button>
            </div>

            {/* Find Match Button */}
            <div className="w-full flex justify-center">
                <FindMatchButton
                    findMatch={handleFindMatch}
                    cancelFindMatch={cancelFindMatch}
                    isFinding={isFinding}
                />
            </div>
        </div>
    );
};

export default FindMatch;