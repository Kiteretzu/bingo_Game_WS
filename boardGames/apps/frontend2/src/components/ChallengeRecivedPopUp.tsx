"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Swords, User } from "lucide-react"

interface GameChallengePopupProps {
  challenger: string
  onAccept: () => void
  onDecline: () => void
}

const GameChallengePopup: React.FC<GameChallengePopupProps> = ({ challenger, onAccept, onDecline }) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const popup = popupRef.current
    const content = contentRef.current

    if (popup && content) {
      // Set initial state
      gsap.set(popup, { scale: 0.8, opacity: 0 })
      gsap.set(content.children, { y: 20, opacity: 0 })

      // Animate in
      const tl = gsap.timeline()
      tl.to(popup, {
        duration: 0.5,
        scale: 1,
        opacity: 1,
        ease: "back.out(1.7)",
      })
        .to(content.children, {
          duration: 0.4,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out",
        })
        .to(popup, {
          duration: 0.2,
          rotate: -2,
          repeat: 1,
          yoyo: true,
          ease: "power1.inOut",
        })
    }

    // Auto-close after 15 seconds
    const timer = setTimeout(() => {
      closePopup()
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  const closePopup = () => {
    const popup = popupRef.current

    if (popup) {
      gsap.to(popup, {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
        ease: "power2.in",
        onComplete: () => {
          onDecline()
        },
      })
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Card ref={popupRef} className="w-full max-w-md bg-gray-900 border-gray-700 text-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500"></div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-100 z-10"
          onClick={closePopup}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardContent className="p-6" ref={contentRef}>
          <div className="flex items-center justify-center mb-4">
            <Swords className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Challenge Incoming!</h2>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                <User className="h-10 w-10 text-gray-300" />
              </div>
              <span className="text-sm font-semibold">{challenger}</span>
            </div>
            <div className="text-4xl font-bold text-red-500">VS</div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                <User className="h-10 w-10 text-gray-300" />
              </div>
              <span className="text-sm font-semibold">You</span>
            </div>
          </div>
          <p className="text-center text-gray-400 mb-6">
            {challenger} wants to challenge you to a duel! Do you accept?
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={onAccept} variant="default" className="bg-red-600 hover:bg-red-700 text-white">
              Accept Challenge
            </Button>
            <Button onClick={closePopup} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GameChallengePopup

