import React, { useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import { useSocket } from '@/hooks/useSocket';
import PlayerDashBoard from '@/components/PlayerDashBoard';
import ResignButton from '@/components/buttons/ResignButton';
import Messages from '@/components/Messages';

function Game() {
    const socket = useSocket()


    return (
        <div className="bg-[#101720] p-24 py-5 text-white w-full min-h-screen">
            <h1 className="text-center my-9 text-lime-500/90 font-bold text-5xl">Bingo</h1>
            <div className='flex gap-x-11 justify-center '>
                <PlayerDashBoard />
                <div className=' flex space-y-7 items-center flex-col w-full'>
                    <Messages />
                    <GameBoard />
                    <ResignButton />
                </div>
                <PlayerDashBoard />

            </div>
            
        </div>
    );
}

export default Game;