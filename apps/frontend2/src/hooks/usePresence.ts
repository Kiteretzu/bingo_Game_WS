import { useEffect, useState } from "react";

export const usePresence = (socket: WebSocket | null) => {
  const [presence, setPresence] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "presence-update") {
        console.log("Presence update:", data);
        const { googleId, isOnline } = data;
        setPresence((prev) => ({ ...prev, [googleId]: isOnline }));
      }

      if (data.type === "presence-snapshot") {
        const onlineUsers = data.onlineUsers as string[];
        console.log('Online users snapshot:', onlineUsers);
        const newPresence: Record<string, boolean> = {};
        for (const id of onlineUsers) {
          newPresence[id] = true;
        }
        setPresence(newPresence);
      }
    };

    socket.addEventListener("message", handleMessage);
  }, [socket]);

  return presence;
};
