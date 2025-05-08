
import { useState, useEffect } from "react"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skull, MinusCircle, X, Minus } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "../ui/button"
import useBingo from "@/hooks/useBingo"


export default function LostDialog({ isOpen }: { isOpen: boolean }) {
    const [animatedMMR, setAnimatedMMR] = useState(0)
    const { setIsLost, lostData } = useBingo()

    useEffect(() => {
        if (isOpen && lostData.data?.totalLosingPoints) {
            const timer = setTimeout(() => {
                setAnimatedMMR(lostData.data?.totalLosingPoints ?? 0)
            }, 500)
            return () => clearTimeout(timer)
        } else {
            setAnimatedMMR(0)
        }
    }, [isOpen])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
            },
        },
    }

    return (
        <Dialog open={isOpen}>
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

                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
                                <motion.div variants={itemVariants} className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Lost Method</h3>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                            delay: 0.2,
                                        }}
                                        className="text-md px-4 py-2 bg-gray-700 text-white rounded-md inline-block"
                                    >
                                        {lostData.method}
                                    </motion.div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">MMR Lost</h3>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                            delay: 0.4,
                                        }}
                                        className="text-3xl font-bold text-red-400 flex items-center justify-center"
                                    >
                                        <Minus className="h-8 w-4 relative" />
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                        >
                                            {animatedMMR}
                                        </motion.span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}

