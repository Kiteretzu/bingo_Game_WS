"use client"

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Swords, User } from "lucide-react"

interface GameChallengePopupProps {
  challenger: string
  onAccept: () => void
  onDecline: () => void
  timeoutDuration?: number
  showCountdown?: boolean
}

const GameChallengePopup = ({
  challenger,
  onAccept,
  onDecline,
  timeoutDuration = 15000,
  showCountdown = true,
}: GameChallengePopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Handle escape key press


  const animateProgress = useCallback(() => {
    if (timerRef.current && showCountdown) {
      gsap.to(timerRef.current, {
        scaleX: 0,
        duration: timeoutDuration / 1000,
        ease: "linear",
      })
    }
  }, [timeoutDuration, showCountdown])

  const animateIn = useCallback(() => {
    if (!popupRef.current || !contentRef.current) return

    gsap.set(popupRef.current, { scale: 0.8, opacity: 0 })
    gsap.set(contentRef.current.children, { y: 20, opacity: 0 })

    const tl = gsap.timeline()
    tl.to(popupRef.current, {
      duration: 0.5,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)",
    })
      .to(contentRef.current.children, {
        duration: 0.4,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
      })


    animateProgress()
  }, [animateProgress])

  const animateOut = useCallback(() => {
    if (!popupRef.current) return

    return gsap.to(popupRef.current, {
      duration: 0.3,
      scale: 0.8,
      opacity: 0,
      ease: "power2.in",
    })
  }, [])

  console.log('called ME?')

  const handleAccept = useCallback(async () => {
    await animateOut()
    onAccept()
  }, [animateOut, onAccept])

  const handleDecline = useCallback(async () => {
    await animateOut()
    onDecline()
  }, [animateOut, onDecline])

  useEffect(() => {
    animateIn()

    timeoutRef.current = setTimeout(handleDecline, timeoutDuration)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      gsap.killTweensOf(popupRef.current)
      if (contentRef.current?.children) {
        gsap.killTweensOf(contentRef.current.children)
      }
      gsap.killTweensOf(timerRef.current)
    }
  }, [animateIn, handleDecline, timeoutDuration])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-title"
    >
      <Card
        ref={popupRef}
        className="w-full max-w-md bg-gray-900 border-gray-700 text-gray-100 overflow-hidden shadow-xl"
      >
        {showCountdown && (
          <div
            ref={timerRef}
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400  to-red-900 origin-left"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 hover:text-white hover:bg-gray-600 z-10"
          onClick={handleDecline}
          aria-label="Close challenge popup"
        >
          <X className="h-4 w-4 font-extrabold " />
        </Button>
        <CardContent className="p-6" ref={contentRef}>
          <div className="flex items-center justify-center mb-4">
            <Swords className="h-16 w-16 text-red-500 animate-pulse" />
          </div>
          <h2 id="challenge-title" className="text-3xl font-bold text-center mb-4">
            Challenge Incoming!
          </h2>
          <div className="flex items-center justify-center space-x-8 mb-6">
            <PlayerAvatar name={challenger} />
            <div className="text-4xl font-bold text-red-500 ">VS</div>
            <PlayerAvatar name="You" />
          </div>
          <p className="text-center text-gray-400 mb-6">
            <span className="font-semibold text-gray-300">{challenger}</span> wants to challenge you to a duel! Do you accept?
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleAccept}
              variant="default"
              className="bg-green-700 hover:bg-green-600 text-white px-8 py-2"
            >
              Accept Challenge
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="bg-red-600 hover:bg-red-700 border-none text-gray-300 px-8 py-2"
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const PlayerAvatar = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center group">
    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
      <User className="h-10 w-10 text-gray-300" />
    </div>
    <span className="text-sm font-semibold">{name}</span>
  </div>
)

export default GameChallengePopup