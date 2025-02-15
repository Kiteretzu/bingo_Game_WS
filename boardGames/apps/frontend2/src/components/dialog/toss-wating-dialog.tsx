"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function TossWaitingDialog({ isOpen }: { isOpen: boolean }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none"
                        aria-hidden="true"
                    />
                    <Dialog open={isOpen}>
                        <DialogContent className="bg-gray-800 border-none focus:border-none focus-visible:outline-none text-white sm:max-w-md">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-white">Waiting for Players</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center space-y-4 pt-4">
                                    <p className="text-lg text-gray-300">Waiting for other players to decide</p>
                                    <div className="flex space-x-2">
                                        {[0, 1, 2].map((i) => (
                                            <motion.span
                                                key={i}
                                                className="inline-block h-4 w-4 rounded-full bg-blue-500"
                                                animate={{
                                                    y: [0, -8, 0],
                                                }}
                                                transition={{
                                                    duration: 0.9,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatType: "loop",
                                                    ease: "easeInOut",
                                                    delay: i * 0.2,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </AnimatePresence>
    )
}

