import { WebSocketServer, WebSocket } from "ws";
import { gameManager } from "./GameManager";
import { v4 as uuidv4 } from "uuid";
import { Server } from "http";
import { CustomError } from "../helper/customError"; // Assuming CustomError class is defined
import { STATUS_CODES } from "../errors";
import jwt from "jsonwebtoken";
import { verifyToken } from "helper";

let wss: WebSocketServer;

// Create WebSocket Server Logic
export function setupWebSocket(server: Server): void {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket, req) => {
    const token = new URLSearchParams(req.url?.split("?")[1]).get("token");

    if (!token) {
      ws.close(1008, "Unauthorized: No Token");
      return;
    }

    try {
      const decoded = verifyToken(token);

      if (!decoded) {
        ws.close(1008, "Unauthorized: Invalid token or token expired");
        return;
      }
      const { googleId } = decoded;

      if (gameManager.isUserReconnecting(googleId))
        gameManager.reconnectToGame(googleId, ws);

      // Add the client to the map and game manager
      console.log(`Client connected. ID: ${googleId}`);
      gameManager.addUser(googleId, token, ws);
      ws.send(`You have been successfully connected`);

      ws.on("error", (error: Error) => {
        handleWebSocketError(error, googleId);
      });

      ws.on("close", () => {
        gameManager.removeUser(googleId);
        console.log(`Client disconnected. ID: ${googleId}`);
      });
    } catch (error) {
      ws.close(1008, "Unauthorized: Invalid token or token expired");
    }
  });

  console.log("WebSocket server is running!");
}

function handleWebSocketError(error: Error, googleId: string): void {
  console.error(`Error from client ${googleId}:`, error.message);

  const customError = new CustomError(
    "Unable to initialize WebSocket connection",
    STATUS_CODES.WEBSOCKET_SERVER_ERROR,
    "WEBSOCKET_SERVER_ERROR"
  );

  // Log the error or take further actions here
  console.error(customError);
}

export function getWebSocketServer(): WebSocketServer {
  if (!wss) {
    throw new Error("WebSocket server is not initialized");
  }
  return wss;
}
