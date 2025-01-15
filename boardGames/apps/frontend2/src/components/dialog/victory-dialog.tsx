'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap, Star, Flame, Check, X } from 'lucide-react'

interface GoalBonus {
    icon: React.ElementType
    text: string
    active: boolean
    mmr: number
}

interface VictoryDialogProps {
    isOpen: boolean
    onClose: () => void
    winMethod: string
    baseMMR: number
    goalBonuses: GoalBonus[]
}

export default function VictoryDialog({
    isOpen,
    onClose,
    winMethod,
    baseMMR,
    goalBonuses
}: VictoryDialogProps) {
    const [animatedMMR, setAnimatedMMR] = useState(0)
    const totalMMR = baseMMR + goalBonuses.reduce((sum, bonus) => bonus.active ? sum + bonus.mmr : sum, 0)

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setAnimatedMMR(totalMMR)
            }, 500)
            return () => clearTimeout(timer)
        } else {
            setAnimatedMMR(0)
        }
    }, [isOpen, totalMMR])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle className="text-4xl font-bold text-center flex items-center justify-center text-yellow-400">
                        <Trophy className="mr-2 h-8 w-8" />
                        Victory!
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-6 space-y-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Win Method</h3>
                        <Badge variant="secondary" className="text-md px-3 py-1 bg-gray-700 text-white">
                            {winMethod}
                        </Badge>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Total MMR Gained</h3>
                        <span className="text-3xl font-bold text-green-400">
                            +{animatedMMR}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center text-gray-300">Goal Bonuses</h3>
                        <ul className="space-y-3">
                            {goalBonuses.map((bonus, index) => (
                                <li key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-800">
                                    <div className="flex items-center">
                                        {bonus.active ? (
                                            <Check className="mr-2 h-5 w-5 text-green-400" />
                                        ) : (
                                            <X className="mr-2 h-5 w-5 text-red-400" />
                                        )}
                                        <span className={`flex items-center ${bonus.active ? 'text-white' : 'text-gray-400'}`}>
                                            <bonus.icon className="mr-2 h-4 w-4" />
                                            {bonus.text}
                                        </span>
                                    </div>
                                    <span className={`font-semibold ${bonus.active ? 'text-green-400' : 'text-gray-500'}`}>
                                        +{bonus.mmr}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        Base MMR: +{baseMMR} | Bonus MMR: +{totalMMR - baseMMR}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

