'use client';

import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Info } from 'lucide-react';

interface Goal {
    id: string;
    name: string;
    description: string;
}

const initialGoals: Goal[] = [
    { id: "first-blood", name: "First Blood", description: "Get the first kill of the match" },
    { id: "double-kill", name: "Double Kill", description: "Kill two enemies within a short time frame" },
    { id: "triple-kill", name: "Triple Kill", description: "Kill three enemies within a short time frame" },
    { id: "perfectionist", name: "Perfectionist", description: "Complete a match without dying" },
    { id: "rampage", name: "Rampage", description: "Get five or more kills in quick succession" },
];

export function PlayerGoals() {
    const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());

    const toggleGoalCompletion = (goalId: string) => {
        setCompletedGoals((prev) => {
            const updated = new Set(prev);
            if (updated.has(goalId)) {
                updated.delete(goalId);
            } else {
                updated.add(goalId);
            }
            return updated;
        });
    };

    return (
        <div className="w-full max-h-fit bg-gray-900 text-gray-100 shadow-xl border-gray-800">
            <CardHeader className="space-y-1 border-b border-gray-800">
                <CardTitle className="text-2xl font-bold flex items-center justify-center text-amber-500">
                    <Trophy className="mr-2" />
                    Player Goals
                </CardTitle>
                <p className="text-sm text-center text-gray-400">
                    Earn bonus points by completing goals.
                </p>
            </CardHeader>
            <CardContent className="pt-4">
                <TooltipProvider>
                    <ul className="space-y-2">
                        {initialGoals.map((goal, index) => {
                            const isCompleted = completedGoals.has(goal.id);
                            return (
                                <li
                                    key={goal.id}
                                    className={`flex items-center space-x-3 rounded-lg p-3 ${isCompleted ? 'bg-gray-700' : 'bg-gray-800'
                                        }`}
                                >
                                    <Checkbox
                                        id={goal.id}
                                        checked={isCompleted}
                                        onCheckedChange={() => toggleGoalCompletion(goal.id)}
                                        className="border-gray-600 data-[state=checked]:bg-transparent data-[state=checked]:border-white"
                                    />
                                    <label
                                        htmlFor={goal.id}
                                        className="flex-grow text-sm font-medium flex items-center justify-between cursor-pointer"
                                    >
                                        <span>
                                            <span
                                                className={`${isCompleted ? 'line-through text-red-500/90 ' : ''
                                                    }`}
                                            >
                                                {goal.name}
                                            </span>
                                        </span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="p-1 rounded-full">
                                                    <Info className="w-4 h-4 text-gray-400" />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                className="bg-gray-700 text-gray-100 border-gray-600"
                                            >
                                                <p className="text-sm">{goal.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </TooltipProvider>
            </CardContent>
        </div>
    );
}