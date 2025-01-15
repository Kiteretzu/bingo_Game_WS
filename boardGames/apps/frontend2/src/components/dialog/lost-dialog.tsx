'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skull, MinusCircle } from 'lucide-react'

interface LostDialogProps {
    isOpen: boolean
    onClose: () => void
    lostMethod: string
    mmrLost: number
}

export default function LostDialog({
    isOpen,
    onClose,
    lostMethod,
    mmrLost
}: LostDialogProps) {
    const [animatedMMR, setAnimatedMMR] = useState(0)

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
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle className="text-4xl font-bold text-center flex items-center justify-center text-red-500">
                        <Skull className="mr-2 h-8 w-8" />
                        Defeated
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-6 space-y-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Lost Method</h3>
                        <Badge variant="secondary" className="text-md px-3 py-1 bg-gray-700 text-white">
                            {lostMethod}
                        </Badge>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">MMR Lost</h3>
                        <span className="text-3xl font-bold text-red-500 flex items-center justify-center">
                            <MinusCircle className="mr-2 h-6 w-6" />
                            {animatedMMR}
                        </span>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        Better luck next time!
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

