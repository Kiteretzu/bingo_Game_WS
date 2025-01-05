
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Match Found!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center space-x-4">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <PlayerProfile {...player1} />
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold"
                            >
                                VS
                            </motion.div>
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <PlayerProfile {...player2} />
                            </motion.div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button
                            size="lg"
                            onClick={handleAccept}
                            disabled={isAccepting}
                            className="w-full max-w-xs"
                        >
                            {isAccepting ? "Accepting..." : "Accept Match"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

