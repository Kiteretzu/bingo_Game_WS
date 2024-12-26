import React, { useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import { useSocket } from '@/hooks/useSocket';

function Game() {
   const socket = useSocket()


    return (
        <div className="bg-[#101720] p-24 text-white w-full min-h-screen">
            <h1 className="text-center text-lime-500/90 font-bold text-5xl">Bingo</h1>
            <div className='flex items-center justify-center flex-col'>

            <GameBoard />
            <button className='px-8 py-3 bg-yellow-300 text-black font-semibold rounded-xl'>
                Join the game
            </button>
            </div>
        </div>
    );
}

export default Game;