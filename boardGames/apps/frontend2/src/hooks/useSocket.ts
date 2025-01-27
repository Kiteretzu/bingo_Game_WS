import { useEffect, useState } from "react";
const WS_URL = "ws://localhost:8080"; // Use wss:// for secure WebSocket connections

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Get the JWT token from localStorage (or wherever it is stored)

    const token = localStorage.getItem("auth-token"); // Ensure this token is available 
    
    if (!token) {
      console.error("No token found!");
      setSocket(null)
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = (event) => {
      console.log(`Connected to WebSocket server`);
      setSocket(ws);
    };

    ws.onclose = (event) => {
      if(event.code === 1008){
        console.log(event.reason)
        console.log('this is socket', socket)
      }
      console.log(`WebSocket connection closed`);
      setSocket(null);
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return socket;
};
