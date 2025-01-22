'use client';

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlayerData } from "@repo/games/bingo/messages";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import useBingo from "@/hooks/useBingo";


export default function MatchFoundScreen() {
    const [countdown, setCountdown] = useState(5);
    const { matchFoundData: data } = useBingo()

    const [player1, player2] = data;
    const navigate = useNavigate()
    const bingoId = useAppSelector(state => state.bingo.game.gameId)
console.log({player1})

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    clearInterval(timer); // Stop the timer
                    navigate(`game/${bingoId}`); // Navigate when the countdown reaches 1
                }
                return prevCount > 1 ? prevCount - 1 : prevCount;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on unmount
    }, [navigate, bingoId]);

    return (
        <div className="flex items-center absolute inset-0 justify-center bg-opacity-80 bg-gray-800 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <Card className="w-full border-none bg-gradient-to-br from-[#323250] to-[#14141a] max-w-2xl shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="relative">
                        <MatchFoundTitle />
                        <SparkleEffect />
                    </CardHeader>
                    <CardContent>
                        <div className="flex relative justify-between items-center space-x-6 py-1">
                            <PlayerCard player={player1} initialX={-100} delay={0.3} />
                            <VsLogo />
                            <PlayerCard player={player2} initialX={100} delay={0.7} />
                        </div>
                    </CardContent>
                    <CountdownDisplay countdown={countdown} />
                </Card>
            </motion.div>
        </div>
    );
}

const MatchFoundTitle = React.memo(() => (
    <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
    >
        <CardTitle className="text-4xl text-white font-bold text-center">
            Match Found!
        </CardTitle>
    </motion.div>
));

const SparkleEffect = React.memo(() => (
    <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
    >
        <Sparkles className="w-full h-full text-yellow-400 opacity-50" />
    </motion.div>
));

const MemoizedPlayerCard = React.memo(PlayerCard);

function PlayerCard({ player, initialX, delay }: { player: PlayerData; initialX: number; delay: number }) {
    return (
        <motion.div
            key={player.user.googleId}
            initial={{ x: initialX, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
        >
            <div className="flex flex-col items-center justify-center">
                <div className="relative">
                    <PlayerProfile user={player.user} />
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-pink-800/85 to-purple-600/90 rounded-full opacity-80 blur"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }}
                        transition={{ delay: delay + 0.2, duration: 0.5 }}
                    />
                </div>
                <AnimatedText
                    text={player.user.displayName}
                    className="text-white mt-4 text-xl font-semibold w-[12ch] truncate"
                    delay={delay + 0.4}
                />
                <AnimatedText
                    text={`Win Rate: ${(player.user.bingoProfile.wins / player.user.bingoProfile.totalMatches)*100}%`}
                    className="text-gray-400 text-sm"
                    delay={delay + 0.5}
                />
            </div>
        </motion.div>
    );
}

function AnimatedText({ text, className, delay }: { text: string; className: string; delay: number }) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
        >
            {text}
        </motion.span>
    );
}

const VsLogo = React.memo(() => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="relative text-4xl flex flex-col font-bold text-white h-full"
    >
        <motion.p
            initial={{ opacity: 0, y: 55 }}
            animate={{ opacity: 1, y: -10 }}
            transition={{ delay: 1, duration: 0.9, type: "spring" }}
            className="text-center"
        >
            <span className="text-green-500">2</span>-
            <span className="text-red-500">3</span>
        </motion.p>
        <div>
            <motion.img
                src="https://upload.wikimedia.org/wikipedia/commons/7/70/Street_Fighter_VS_logo.png"
                className="w-20 h-20 object-contain"
                alt="VS Logo"
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.5 }}
            />
        </div>
    </motion.div>
));

const CountdownDisplay = React.memo(({ countdown }: { countdown: number }) => (
    <div className="flex justify-center items-center h-24 bg-gradient-to-t from-[#1C1C1E] to-transparent">
        <AnimatePresence mode="wait">
            <motion.div
                key={countdown}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-white text-center"
            >
                Game will start in{' '}
                <span className="text-4xl text-yellow-400">{countdown}</span>s
            </motion.div>
        </AnimatePresence>
    </div>
));

const PlayerProfile = React.memo(({ user }: { user: PlayerData['user'] }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <div className="relative w-24 h-24 rounded-full cursor-pointer overflow-hidden border-4 border-primary">
                    <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={`${user.displayName}'s profile`}
                        className="object-cover w-full h-full"
                    />
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <div className="text-center">
                    <p className="font-semibold">{user.displayName}</p>
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
));