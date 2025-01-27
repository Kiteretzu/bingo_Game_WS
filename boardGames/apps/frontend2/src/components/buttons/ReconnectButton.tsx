import React, { useState } from 'react';
import { useAppSelector } from "@/store/hooks";
import { ActionButton } from "./ActionButton";
import { cn } from "@/lib/utils";

function ReconnectMatchButton({
    reconnect,
    maxReconnectAttempts = 3
}: {
    reconnect: () => Promise<boolean>;
    maxReconnectAttempts?: number;
}) {
    const isAuth = useAppSelector(state => state.profile.isAuth);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [reconnectError, setReconnectError] = useState(false);

    const handleReconnect = async () => {
        if (reconnectAttempts >= maxReconnectAttempts) {
            setReconnectError(true);
            return;
        }

        setIsReconnecting(true);
        try {
            const success = await reconnect();
            if (!success) {
                setReconnectAttempts(prev => prev + 1);
                setReconnectError(reconnectAttempts + 1 >= maxReconnectAttempts);
            } else {
                setReconnectAttempts(0);
                setReconnectError(false);
            }
        } catch (error) {
            setReconnectAttempts(prev => prev + 1);
            setReconnectError(reconnectAttempts + 1 >= maxReconnectAttempts);
        } finally {
            setIsReconnecting(false);
        }
    };

    if (reconnectError) {
        return (
            <div className="text-red-500 text-center">
                Unable to reconnect. Please try again later.
            </div>
        );
    }

    return (
        <ActionButton
            className={cn(
                "px-24 py-4 font-jaro text-2xl text-white rounded transition-colors",
                isReconnecting && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleReconnect}
            disabled={!isAuth || isReconnecting}
        >
            {isReconnecting
                ? `Reconnecting (${reconnectAttempts + 1}/${maxReconnectAttempts})`
                : "RECONNECT"
            }
        </ActionButton>
    );
}

export default ReconnectMatchButton;