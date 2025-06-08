import React, { useState } from 'react';
import { useAppSelector } from "@/store/hooks";
import { ActionButton } from "./ActionButton";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

function ReconnectMatchButton() {

    const navigate = useNavigate()
    const gameId = useAppSelector(state => state.bingo.game.gameId)

    const handleReconnect = async () => {
        navigate(`/game/${gameId}`)
    }

    return (
        <ActionButton
            className={cn(
                "px-24 py-4 font-jaro text-2xl text-white rounded transition-colors bg-red-800/85",
            )}
            onClick={handleReconnect}
        >
            RECONNECT
        </ActionButton>
    );
}

export default ReconnectMatchButton;