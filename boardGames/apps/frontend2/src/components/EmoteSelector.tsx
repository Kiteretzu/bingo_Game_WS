'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, ThumbsUp, Heart, Star, Zap, FlameIcon as Fire } from 'lucide-react'

const emotes = [
    { icon: Smile, name: 'Smile' },
    { icon: ThumbsUp, name: 'Thumbs Up' },
    { icon: Heart, name: 'Heart' },
    { icon: Star, name: 'Star' },
    { icon: Zap, name: 'Zap' },
    { icon: Fire, name: 'Fire' },
]

export function EmoteSelector() {
    const [selectedEmote, setSelectedEmote] = useState<string | null>(null)

    return (
        <div className="w-full max-w-md bg-gray-900 text-gray-100 shadow-xl">
            <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4">
                    {emotes.map((emote) => (
                        <Button
                            key={emote.name}
                            variant="outline"
                            className={`h-24 w-full ${selectedEmote === emote.name
                                    ? 'bg-amber-500 text-gray-900'
                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-100'
                                }`}
                            onClick={() => setSelectedEmote(emote.name)}
                        >
                            <emote.icon className="h-12 w-12" />
                        </Button>
                    ))}
                </div>
                {selectedEmote && (
                    <p className="mt-4 text-center text-gray-400">
                        You selected: <span className="text-amber-500">{selectedEmote}</span>
                    </p>
                )}
            </CardContent>
        </div>
    )
}

