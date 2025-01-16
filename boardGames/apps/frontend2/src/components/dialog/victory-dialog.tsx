"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useBingo from "@/hooks/useBingo"

interface VictoryDialogProps {
    isOpen: boolean
    winMethod: string
    totalMMR: number
    baseMMR: number,
}

export function VictoryDialog({ isOpen, winMethod, totalMMR, baseMMR }: VictoryDialogProps) {
    const [animatedMMR, setAnimatedMMR] = useState(0)
    const { setIsVictory, isVictory } = useBingo()


    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setAnimatedMMR(totalMMR)
            }, 100)
            return () => clearTimeout(timer)
        } else {
            setAnimatedMMR(0)
        }
    }, [isOpen, totalMMR])

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[500px] border-none bg-gradient-to-br from-[#323250] to-[#14141a] p-0">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                        >
                            <DialogHeader className="relative text-center py-6">
                                <DialogTitle className="text-5xl font-bold text-yellow-400 flex items-center justify-center">
                                    <Trophy className="mr-3 h-12 w-12" />
                                    Victory!
                                </DialogTitle>
                                <DialogClose asChild>
                                    <Button
                                        onClick={() => {
                                            console.log('wow',isVictory)
                                            setIsVictory(false)}}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
                                    >
                                        <X className="h-4 w-4 text-yellow-400" />
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </DialogClose>
                            </DialogHeader>

                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-300">Win Method</h3>
                                    <div className="text-md px-4 py-2 bg-gray-700 text-white rounded-md inline-block">
                                        {winMethod}
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-300">Total MMR Gained</h3>
                                    <span className="text-5xl font-bold text-green-400 animate-pulse">
                                        +{animatedMMR}
                                    </span>
                                </div>

                                <div className="text-center text-sm text-gray-400">
                                    Base MMR: +{baseMMR} | Bonus MMR: +{animatedMMR - baseMMR}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}

