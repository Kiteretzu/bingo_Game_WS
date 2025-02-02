'use client'

import GameBoard from '@/components/BingoBoard'
import PlayerDashBoard from '@/components/PlayerDashBoard'
import ResignButton from '@/components/buttons/ResignButton'
import Messages from '@/components/Messages'
import { CardContent } from '@/components/ui/card'
import { EmoteSelector } from '@/components/EmoteSelector'
import { PlayerGoals } from '@/components/player-goals'
import { VictoryDialog } from '@/components/dialog/victory-dialog'
import useBingo from '@/hooks/useBingo'
import LostDialog from '@/components/dialog/lost-dialog'
import "@/components/test.css"
import backgroundImg from "@/assets/darkBackground.png";
import { useNavigate } from 'react-router-dom'

export default function Game() {
    const { isVictory, isLost, gameBoard } = useBingo()
    const navigate = useNavigate()
    console.log({ isVictory, isLost })


    return (
        <div
            className="min-h-screen overflow-hidden bg-gradient-to-b from-gray-900/10 to-gray-800/55 text-gray-100 flex flex-col"
            style={{ backgroundImage: `url(${backgroundImg})` }} >
            <div onClick={() => navigate('/')} className="flex cursor-pointer justify-center items-center h-20 py-12 bg-gray-800/85 shadow-lg border-b border-gray-700">
                <img
                    src="/Bingo.png"
                    className="h-40 object-contain pointer-events-none"
                    alt="Bingo"
                />
            </div>
            <div className="flex-grow p-6 lg:p-14 bg-gray-900/50 backdrop-blur-sm border-gray-700 mx-4 lg:mx-auto w-full overflow-y-auto">
                <CardContent className="min-h-fit p-4 flex flex-col lg:flex-row gap-6 justify-between">
                    <div className='w-full  flex flex-col rounded-xl overflow-hidden items-center bg-gray-800 border border-gray-700 shadow-lg'>
                        <PlayerGoals />
                        <EmoteSelector />
                    </div>
                    <div className="flex flex-col h-full justify-between items-center space-y-6 w-full lg:w-1/2">
                        <Messages />
                        <GameBoard />
                        <ResignButton />
                    </div>
                    <PlayerDashBoard />
                </CardContent>
            </div>
            <VictoryDialog isOpen={isVictory} />
            <LostDialog isOpen={isLost} />
        </div>
    )
}

