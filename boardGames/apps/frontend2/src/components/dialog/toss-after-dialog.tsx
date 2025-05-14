"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useBingo from "@/hooks/useBingo"

export function TossOptionDialog({ isOpen }: { isOpen: boolean }) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const dialogRef = useRef(null)
    const optionsRef = useRef<(HTMLButtonElement | null)[]>([])
    const { handleTossDecision } = useBingo()
    // Open dialog automatically on component mount


    // GSAP animations for dialog and buttons
    useEffect(() => {
        if (isOpen) {
            gsap.from(dialogRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(1.7)",
            })

            gsap.from(optionsRef.current, {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: "back.out(1.7)",
            })
        }
    }, [isOpen])

    const handleOptionClick = (option: string) => {
        setSelectedOption(option)
        handleTossDecision(option === "FIRST" ? "FIRST" : "SECOND")

        // Animate both buttons based on selection
        optionsRef.current.forEach((btn, index) => {
            gsap.to(btn, {
                scale: btn?.textContent === (option === "FIRST" ? "Go first" : "Go second") ? 1.1 : 0.9,
                opacity: btn?.textContent === (option === "FIRST" ? "Go first" : "Go second") ? 1 : 0.5,
                duration: 0.3,
                ease: "power2.out",
            })
        })
    }

    const handleOptionHover = (index: number, isHovering: boolean) => {
        gsap.to(optionsRef.current[index], {
            scale: isHovering ? 1.05 : 1,
            duration: 0.2,
        })
    }

    return (
        <>
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(5px)",
                        zIndex: 10, // Ensure it's behind the dialog
                        pointerEvents: "none", // Allow clicks to pass through
                    }}
                />
            )}
            <Dialog open={isOpen} >
                <DialogContent className="bg-gray-800 border-none focus:border-none  focus-visible:outline-none text-white sm:max-w-md" ref={dialogRef}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white">Select Your Preference</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4 pt-4">
                        <Button
                            disabled={!!selectedOption}
                            ref={(el) => (optionsRef.current[0] = el)}
                            variant={selectedOption === "Go first" ? "default" : "secondary"}
                            onClick={() => handleOptionClick("FIRST")}
                            onMouseEnter={() => handleOptionHover(0, true)}
                            onMouseLeave={() => handleOptionHover(0, false)}
                            className="bg-gray-700 text-lg text-white hover:bg-gray-600"
                        >
                            Go first
                        </Button>
                        <Button
                            disabled={!!selectedOption}
                            ref={(el) => (optionsRef.current[1] = el)}
                            variant={selectedOption === "Go second" ? "default" : "secondary"}
                            onClick={() => handleOptionClick("SECOND")}
                            onMouseEnter={() => handleOptionHover(1, true)}
                            onMouseLeave={() => handleOptionHover(1, false)}
                            className="bg-gray-700 text-lg text-white hover:bg-gray-600"
                        >
                            Go second
                        </Button>
                    </div>
                    {selectedOption && <p className="mt-4 text-center text-sm text-gray-300">You selected: {selectedOption}</p>}
                </DialogContent>
            </Dialog>
        </>
    )
}