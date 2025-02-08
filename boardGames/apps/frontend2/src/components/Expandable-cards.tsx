"use client"
import type React from "react"
import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "../hooks/use-outside-click.js"

interface ExpandableCardProps {
    item: React.ReactNode
    renderItem: (item: React.ReactNode, isExpanded: boolean) => React.ReactNode
    className?: string
    maxHeight?: string
    maxWidth?: string
    expandedMaxHeight?: string
}

export function ExpandableCard({
    item,
    renderItem,
    className = "",
    maxHeight = "max-h-[300px]",
    maxWidth = "max-w-[500px]",
    expandedMaxHeight = "max-h-[80vh]",
}: ExpandableCardProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null)
    const itemRef = useRef<HTMLDivElement | null>(null)
    const id = useId()

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsExpanded(false)
        }

        if (isExpanded) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [isExpanded])

    useEffect(() => {
        const checkOverflow = () => {
            if (itemRef.current) {
                setIsOverflowing(itemRef.current.scrollHeight > itemRef.current.clientHeight)
            }
        }

        checkOverflow()
        window.addEventListener("resize", checkOverflow)
        return () => window.removeEventListener("resize", checkOverflow)
    }, [])

    useOutsideClick(ref, () => setIsExpanded(false))

    return (
        <div className="h-full">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isExpanded && (
                    <div className="fixed inset-0 grid place-items-center ">
                        <motion.button
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setIsExpanded(false)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${id}`}
                            ref={ref}
                            className={`w-full ${maxWidth} bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-lg ${className}`}
                        >
                            <div className={`overflow-auto ${expandedMaxHeight} relative`}>
                                {renderItem(item, true)}
                                {isOverflowing && (
                                    <div className="absolute bottom-0 left-0 right-0 h pointer-events-none" />
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div
                layoutId={`card-${id}`}
                onClick={() => setIsExpanded(true)}
                className={`cursor-pointer bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow  h-full ${maxHeight}`}
            >
                <div className="relative bg-purple-700 h-full" ref={itemRef}>
                    {renderItem(item, false)}
                    {isOverflowing && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-600 to-transparent pointer-events-none w-full" />
                    )}

                </div>
            </motion.div>
        </div>
    )
}

const CloseIcon = () => (
    <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-black"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
    </motion.svg>
)