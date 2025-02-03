import React, { createContext, useContext, useState } from "react";
import { PAYLOAD_GET_LOST, PAYLOAD_GET_VICTORY, PlayerData } from "@repo/games/mechanics";

type DialogContextType = {
    isMatchFound: boolean;
    setIsMatchFound: React.Dispatch<React.SetStateAction<boolean>>;
    matchFoundData: PlayerData[]; // Replace `any` with the specific type if possible.
    setMatchFoundData: React.Dispatch<React.SetStateAction<PlayerData[]>>;
    isVictory: boolean;
    setIsVictory: React.Dispatch<React.SetStateAction<boolean>>;
    victoryData: PAYLOAD_GET_VICTORY['payload']; // Replace `any` with the specific type.
    setVictoryData: React.Dispatch<React.SetStateAction<PAYLOAD_GET_VICTORY['payload']>>;
    isLost: boolean;
    setIsLost: React.Dispatch<React.SetStateAction<boolean>>;
    lostData: PAYLOAD_GET_LOST['payload']; // Replace `any` with the specific type.
    setLostData: React.Dispatch<React.SetStateAction<PAYLOAD_GET_LOST['payload']>>;
    emote: string;
    setEmote: React.Dispatch<React.SetStateAction<string>>;
    isReconnectGame: boolean;
    setIsReconnectGame: React.Dispatch<React.SetStateAction<boolean>>;
    
};

// Create a context with a default value of `null`
export const DialogContext = createContext<DialogContextType | null>(null);

const DialogContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // States for dialog logic
    const [isReconnectGame, setIsReconnectGame] = useState(false)
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
                isReconnectGame,
                setIsReconnectGame
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