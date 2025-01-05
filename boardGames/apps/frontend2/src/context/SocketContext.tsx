import React, { createContext, useContext } from 'react';
import { useSocket } from "../hooks/useSocket";

type SocketContextType = WebSocket | null;

// Create a context with a default value of `null`
export const SocketContext = createContext<SocketContextType>(null);

const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize WebSocket connection using your custom hook
  const socket = useSocket();
  if (!socket) return
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;

// Custom Hook for consuming the context
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocketContext must be used within a SocketContextProvider OR GETTING SOCKET TO BE NULL");
  }
  return context;
};