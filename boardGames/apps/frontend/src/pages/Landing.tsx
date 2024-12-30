import { GAME_INIT, MessageType, SEND_CHECKBOXES, SEND_GAMEBOARD } from '@repo/games/bingo'; // Removed unused `SEND_ID`
import FindMatchButton from '@/components/buttons/FindMatchButton';
import useGame from '@/hooks/useGame';
import { useSocket } from '@/hooks/useSocket';
import React, { useEffect, useRef, useState } from 'react';

function Landing() {
    const inputRef = useRef<HTMLInputElement | null>(null); // Reference for input field
    const socket = useSocket(); // WebSocket hook
    const [isFinding, setIsFinding] = useState(false); // State for matchmaking status
    const { getMessage, sendMessage } = useGame(); // Custom hook to handle game actions

    useEffect(() => {
        if (!socket) return
        socket.onmessage = (message: MessageEvent) => {
            console.log('m i mussing something?',)
            switch (message.type as MessageType) {
                case SEND_GAMEBOARD: {
                    console.log("hello in here case send landingPage");
                    getMessage(SEND_GAMEBOARD, message.data)
                    break;
                }
                case SEND_CHECKBOXES: {
                    getMessage(SEND_CHECKBOXES, message.data)
                    break;
                }

                case GAME_INIT: {
                    getMessage(GAME_INIT, message.data)
                    break;
                }
            }
        };
    }, [socket]);

    const handleFindMatch = () => {
        const inputValue = inputRef.current?.value?.trim(); // Ensure input is trimmed
        if (!inputValue) {
            console.error('Name is required to find a match.');
            return;
        }

        setIsFinding(true);
        console.log('Input value:', inputValue);

        // Send game initialization data
        try {
            sendMessage(GAME_INIT, inputValue);
        } catch (error) {
            console.error('Error sending game initialization data:', error);
            setIsFinding(false); // Reset state on error
        }
    };

    // Function to handle matchmaking cancellation
    const handleCancel = () => {
        setIsFinding(false);
        console.log('Matchmaking canceled.');

        // Send cancellation data to the server
        const cancelData = { type: 'cancel_game_init' };
        try {
            socket?.send(JSON.stringify(cancelData));
        } catch (error) {
            console.error('Error sending cancel data to WebSocket:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Welcome to the Game</h1>
                <p className="text-gray-400 mb-6">Enter your name to start playing</p>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <FindMatchButton
                    cancelFindMatch={handleCancel}
                    isFinding={isFinding}
                    findMatch={handleFindMatch}
                />
            </div>
        </div>
    );
}

export default Landing;
