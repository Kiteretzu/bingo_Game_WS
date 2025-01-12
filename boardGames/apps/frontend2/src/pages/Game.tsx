'use client'

import GameBoard from '@/components/BingoBoard'
import { useSocket } from '@/hooks/useSocket'
import PlayerDashBoard from '@/components/PlayerDashBoard'
import ResignButton from '@/components/buttons/ResignButton'
import Messages from '@/components/Messages'
import { Card, CardContent } from '@/components/ui/card'
import ChatSystem from '@/components/ChatSystem'

export default function Game() {
    const socket: WebSocket | null = useSocket()

    if (!socket) return null

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white flex flex-col">
            <h1 className="text-center py-4 text-4xl xl:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Bingo Blitz
            </h1>
            <Card className="flex-grow bg-gray-800/50 backdrop-blur-sm border-gray-700 px-3 overflow-y-scroll">
                <CardContent className="min-h-fit p-4 flex flex-col lg:flex-row border gap-4 justify-between">
                    <ChatSystem className='max-lg:hidden' player='sammy' />
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

