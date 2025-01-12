'use client'

import GameBoard from '@/components/BingoBoard'
import { useSocket } from '@/hooks/useSocket'
import PlayerDashBoard from '@/components/PlayerDashBoard'
import ResignButton from '@/components/buttons/ResignButton'
import Messages from '@/components/Messages'
import { Card, CardContent } from '@/components/ui/card'
import { EmoteSelector } from '@/components/EmoteSelector'
import { PlayerGoals } from '@/components/player-goals'

export default function Game() {
    const socket: WebSocket | null = useSocket()

    if (!socket) return null

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white flex flex-col">
            <div className="flex justify-center items-center h-20 py-12 bg-gray-900/80 shadow-lg mb-5 ">
                <img
                    src="/Bingo.png"
                    className="h-40 object-contain pointer-events-none"
                    alt="Bingo"
                />
            </div>
            <Card className="flex-grow p-14  bg-gray-800/50 backdrop-blur-sm border-gray-700 px-3 overflow-y-scroll">
                <CardContent className="min-h-fit p-4 flex flex-col lg:flex-row  gap-4 justify-between">
                    <div className=' w-full flex flex-col rounded-xl py-2 overflow-hidden items-center bg-gray-900 border-gray-700'>
                        <PlayerGoals />
                        <EmoteSelector />
                    </div>
                    <div className="flex flex-col h-full  justify-between items-center space-y-4 w-full ">
                        <Messages />
                        <GameBoard />
                        <ResignButton />
                    </div>
                    <PlayerDashBoard player="Player 2" />
                </CardContent>
            </Card>
        </div>
    )
}

