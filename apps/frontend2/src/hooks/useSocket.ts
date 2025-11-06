import { useEffect, useState, useRef } from "react";
const WS_URL = "ws://localhost:4000"; // Use wss:// for secure WebSocket connections

type MessageCallback = (message: unknown) => void;

const messageCallbacks = new Set<MessageCallback>();

export const registerMessageHandler = (callback: MessageCallback): (() => void) => {
  messageCallbacks.add(callback);
  
  return () => {
    messageCallbacks.delete(callback);
  };
};

const handleSocketMessage = (event: MessageEvent) => {
  try {
    const parsedMessage = JSON.parse(event.data);
    console.log("Received message:", parsedMessage);
    
    // Call all registered callbacks
    messageCallbacks.forEach((callback) => {
      try {
        callback(parsedMessage);
      } catch (error) {
        console.error("Error in message callback:", error);
      }
    });
  } catch (error) {
    console.error("Error parsing socket message:", error);
  }
};

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {

    const token = localStorage.getItem("auth-token"); // Ensure this token is available
    console.log("is this useSocket working? 🥹", token);
    if (!token) {
      console.error("No token found!");
      setSocket(null);
      socketRef.current = null;
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to WebSocket server`);
      setSocket(ws);
    };

    ws.onclose = (event) => {
      if (event.code === 1008) {
        console.log(event.reason);
        console.log("this is socket", socketRef.current);
      }
      console.log(`WebSocket connection closed`);
      setSocket(null);
      socketRef.current = null;
    };

    // centralized message handler
    ws.onmessage = handleSocketMessage;

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, []);

  return socket;
};
