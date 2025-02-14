import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const TierSelectionDialog = ({ selectedTier, onSelectTier, isOpen, setIsOpen }) => {
    const tiers = [
        {
            name: 'TIER A',
            color: 'bg-gradient-to-r from-purple-800 via-indigo-900 to-blue-900',
            description: 'Wager 1000Rs',
            border: 'border-2 border-purple-500'
        },
        {
            name: 'TIER B',
            color: 'bg-gradient-to-r from-cyan-800 to-teal-900',
            description: 'Wager 500Rs',
            border: 'border-2 border-cyan-400'
        },
        {
            name: 'TIER C',
            color: 'bg-gradient-to-r from-orange-800 to-amber-900',
            description: 'Wager 200Rs',
            border: 'border-2 border-orange-500'
        },
        {
            name: 'TIER D',
            color: 'bg-gradient-to-r from-green-800 to-emerald-900',
            description: 'Wager 100Rs',
            border: 'border-2 border-green-500'
        },
        {
            name: 'TIER E',
            color: 'bg-gradient-to-r from-blue-800 to-sky-900',
            description: 'Wager 50Rs',
            border: 'border-2 border-blue-500'
        },
        {
            name: 'TIER F',
            color: 'bg-gradient-to-r from-gray-800 to-slate-900',
            description: 'Friendly Match',
            border: 'border-2 border-gray-500'
        },
    ];

    const getSelectedTierStyle = () => {
        const selected = tiers.find(tier => tier.name === selectedTier);
        return selected ? `${selected.color} ${selected.border}` : 'bg-gray-800';
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                className={`px-6 py-1 text-white rounded-lg transition-all duration-200 hover:opacity-90 shadow-lg ${getSelectedTierStyle()}`}
            >
                {selectedTier || 'Select Match Tier'}
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border border-gray-700 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center pb-4">Select Match Tier</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                    {tiers.map((tier) => (
                        <button
                            key={tier.name}
                            onClick={() => {
                                onSelectTier(tier.name);
                                setIsOpen(false); // Close the dialog when a tier is selected
                            }}
                            className={`
                                ${tier.color} ${tier.border}
                                p-4 rounded-lg text-left
                                transition-all duration-200
                                hover:scale-[1.02] hover:opacity-90
                                ${selectedTier === tier.name ? 'ring-2 ring-white' : ''}
                                flex justify-between items-center
                                shadow-lg
                            `}
                        >
                            <div>
                                <div className="font-bold text-lg">{tier.name}</div>
                                <div className="text-sm opacity-90">{tier.description}</div>
                            </div>
                            {selectedTier === tier.name && (
                                <div className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                                    Selected
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TierSelectionDialog;