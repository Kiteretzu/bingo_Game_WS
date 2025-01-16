'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skull, MinusCircle, X, Minus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../ui/button'
import useBingo from '@/hooks/useBingo'

interface LostDialogProps {
    isOpen: boolean
    onClose?: () => void
    lostMethod?: string
    mmrLost: number
}

export default function LostDialog({
    isOpen,
    onClose,
    lostMethod,
    mmrLost
}: LostDialogProps) {
    const [animatedMMR, setAnimatedMMR] = useState(0)
    const { setIsLost } = useBingo()

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setAnimatedMMR(mmrLost)
            }, 500)
            return () => clearTimeout(timer)
        } else {
            setAnimatedMMR(0)
        }
    }, [isOpen, mmrLost])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-none bg-gradient-to-br from-[#2a2a37] to-[#14141a] p-0">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                        >
                            <DialogHeader className="relative text-center py-6">
                                <DialogTitle className="text-5xl font-bold text-red-500 flex items-center justify-center">
                                    <Skull className="mr-3 h-12 w-12" />
                                    Defeated
                                </DialogTitle>
                                <DialogClose onClick={() => setIsLost(false)} asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                                    >
                                        <X className="h-4 w-4 text-red-500" />
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </DialogClose>
                            </DialogHeader>

                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-300">Lost Method</h3>
                                    <div className="text-md px-4 py-2 bg-gray-700 text-white rounded-md inline-block">
                                        {lostMethod}
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-300">MMR Lost</h3>
                                    <p className="text-3xl text-center relative -left-2 font-bold text-red-400 animate-pulse flex items-center justify-center">
                                        <Minus className="h-8 w-4 relative" />
                                        {animatedMMR}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}

