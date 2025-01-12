import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayerProfile } from "./player-profile"

interface Player {
    name: string
    image: string
    record: string
}

interface MatchFoundScreenProps {
    player1: Player
    player2: Player
    onAccept: () => void
}

export default function MatchFoundScreen({ player1, player2, onAccept }: MatchFoundScreenProps) {
    const [isAccepting, setIsAccepting] = useState(false)

    const handleAccept = () => {
        setIsAccepting(true)
        // Simulate a delay before calling onAccept
        setTimeout(() => {
            onAccept()
        }, 1000)
    }

    return (
        <div className="flex items-center absolute inset-0 justify-center bg-opacity-50 bg-gray-800">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="w-full border-none bg-[#1C1C1E] max-w-md shadow-xl rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl text-white font-semibold text-center">Match Found!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex relative justify-between items-center space-x-6">
                            {/* Player 1 */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <PlayerProfile {...player1} />
                                    <span className="text-white mt-3 text-lg">Player 1</span>
                                </div>
                            </motion.div>

                            {/* VS Logo */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="relative text-4xl font-bold text-white"
                            >
                                <motion.p
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: -55 }}
                                    transition={{ duration: 0.9 }}
                                    className="absolute top-0 transform "
                                >
                                    <span className="text-green-600">2</span>-
                                    <span className="text-red-600">3</span>
                                </motion.p>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/70/Street_Fighter_VS_logo.png"
                                    className="w-14"
                                    alt="VS Logo"
                                />
                            </motion.div>

                            {/* Player 2 */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <PlayerProfile {...player2} />
                                    <span className="text-white mt-3 text-lg">Player 2</span>
                                </div>
                            </motion.div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            size="lg"
                            onClick={handleAccept}
                            disabled={isAccepting}
                            className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                        >
                            {isAccepting ? "Accepting..." : "Accept Match"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}