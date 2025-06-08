
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useBingo from "@/hooks/useBingo";
import type { WinnerMMR } from "@repo/messages/message";

type GoalItem = { label: string; value: number };

export function VictoryDialog({ isOpen }: { isOpen: boolean }) {
    const [animatedMMR, setAnimatedMMR] = useState(0);
    const [winMethod, setWinMethod] = useState("");
    const { setIsVictory, victoryData } = useBingo();

    // Generate goal items
    const goalItems: GoalItem[] = [
        ["Base Winning Points", "baseWinningPoints"],
        ["First Blood", "firstBloodPoints"],
        ["Double Kill", "doubleKillPoints"],
        ["Triple Kill", "tripleKillPoints"],
        ["Perfectionist", "perfectionistPoints"],
        ["Rampage", "rampagePoints"],
    ]
        .map(([label, key]) => ({
            label,
            value: victoryData?.data?.[key as keyof WinnerMMR] ?? 0,
        }))
        .filter((item) => item.value > 0);

    // Handle victoryData updates
    useEffect(() => {
        if (!victoryData || !isOpen) {
            setAnimatedMMR(0);
            return;
        }

        setWinMethod(victoryData.method);
        console.log('in here the Bingo', victoryData)
        const timer = setTimeout(() => setAnimatedMMR(victoryData.data?.totalWinningPoints ?? 0), 100);
        return () => clearTimeout(timer);
    }, [isOpen, victoryData]);

    // Fallback content for null victoryData
    if (!victoryData) {
        return null; // Or display a loading spinner if required
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

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
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[500px] border-none bg-gradient-to-br from-[#323250] to-[#14141a] p-0">
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring" }}
                        >
                            <DialogHeader className="relative text-center py-6">
                                <DialogTitle className="text-5xl font-bold text-yellow-400 flex items-center justify-center">
                                    <Trophy className="mr-3 h-12 w-12" />
                                    Victory!
                                </DialogTitle>
                                <DialogClose asChild>
                                    <Button
                                        onClick={() => setIsVictory(false)}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
                                    >
                                        <X className="h-4 w-4 text-yellow-400" />
                                        <span className="sr-only">Close</span>
                                    </Button>
                                </DialogClose>
                            </DialogHeader>

                            <div className="p-6 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center"
                                >
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Win Method</h3>
                                    <div className="text-md px-4 py-2 bg-gray-700 text-white rounded-md inline-block">{winMethod}</div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-center"
                                >
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total MMR Gained</h3>
                                    <motion.span
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        className="text-5xl font-bold text-green-400 inline-block"
                                    >
                                        +{animatedMMR}
                                    </motion.span>
                                </motion.div>

                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
                                    {goalItems.map((item) => (
                                        <motion.div
                                            key={item.label}
                                            variants={itemVariants}
                                            className="flex justify-between items-center bg-gray-700 rounded-md p-2"
                                        >
                                            <span className="text-gray-300">{item.label}</span>
                                            <motion.span
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                                className="text-yellow-400 font-semibold"
                                            >
                                                +{item.value}
                                            </motion.span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}