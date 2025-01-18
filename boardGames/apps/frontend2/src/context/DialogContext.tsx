import React, { createContext, useContext, useState } from "react";
import { useSocket } from "../hooks/useSocket"; // Custom hook for WebSocket handling.
import { PlayerData } from "@repo/games/bingo/messages";

type DialogContextType = {
    isMatchFound: boolean;
    setIsMatchFound: React.Dispatch<React.SetStateAction<boolean>>;
    matchFoundData: PlayerData[]; // Replace `any` with the specific type if possible.
    setMatchFoundData: React.Dispatch<React.SetStateAction<PlayerData[]>>;
    isVictory: boolean;
    setIsVictory: React.Dispatch<React.SetStateAction<boolean>>;
    victoryData: any; // Replace `any` with the specific type.
    setVictoryData: React.Dispatch<React.SetStateAction<any>>;
    isLost: boolean;
    setIsLost: React.Dispatch<React.SetStateAction<boolean>>;
    lostData: any; // Replace `any` with the specific type.
    setLostData: React.Dispatch<React.SetStateAction<any>>;
    emote: string;
    setEmote: React.Dispatch<React.SetStateAction<string>>;
};

// Create a context with a default value of `null`
export const DialogContext = createContext<DialogContextType | null>(null);

const DialogContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // States for dialog logic
    const [isMatchFound, setIsMatchFound] = useState(false);
    const [matchFoundData, setMatchFoundData] = useState<any>(null); // Replace `any` with a specific type.
    const [isVictory, setIsVictory] = useState(false);
    const [victoryData, setVictoryData] = useState<any>(null); // Replace `any` with a specific type.
    const [isLost, setIsLost] = useState(false);
    const [lostData, setLostData] = useState<any>(null); // Replace `any` with a specific type.
    const [emote, setEmote] = useState<string>("");

    return (
        <DialogContext.Provider
            value={{
                isMatchFound,
                setIsMatchFound,
                matchFoundData,
                setMatchFoundData,
                isVictory,
                setIsVictory,
                victoryData,
                setVictoryData,
                isLost,
                setIsLost,
                lostData,
                setLostData,
                emote,
                setEmote,
            }}
        >
            {children}
        </DialogContext.Provider>
    );
};

export default DialogContextProvider;

// Custom Hook for consuming the context
export const useDialogContext = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error(
            "useDialogContext must be used within a DialogContextProvider."
        );
    }
    return context;
};