import { WebSocketServer, WebSocket } from "ws";
import { gameManager } from "./GameManager";
import { v4 as uuidv4 } from "uuid";
import { Server } from "http";
import { CustomError } from "../helper/customError"; // Assuming CustomError class is defined
import { STATUS_CODES } from "../errors";
import jwt from "jsonwebtoken";
import { verifyToken } from "helper";
import {
  getRedisClient,
  getRedisSubscriberClient,
} from "../../../../packages/redis/src/config/redisClient";

let wss: WebSocketServer;

// Create WebSocket Server Logic
export async function setupWebSocket(server: Server): Promise<void> {
  wss = new WebSocketServer({ server });

  // Initialize Redis clients for presence tracking
  const pub = await getRedisClient();
  const sub = await getRedisSubscriberClient();
  await sub.subscribe("presence", (message) => {
    const { googleId, isOnline } = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "presence-update",
            googleId,
            isOnline,
          })
        );
      }
    });
  });

  wss.on("connection", async (ws: WebSocket, req) => {
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

      const keys = await pub.keys("presence:*");
      const onlineGoogleIds = keys.map((k) => k.replace("presence:", ""));
  console.log('onlineGoogleIds', onlineGoogleIds)
      ws.send(
        JSON.stringify({
          type: "presence-snapshot",
          onlineUsers: onlineGoogleIds,
        })
      );

      // Publish online presence
      pub.publish("presence", JSON.stringify({ googleId, isOnline: true }));
      await pub.set(`presence:${googleId}`, "true");

      ws.on("error", (error: Error) => {
        handleWebSocketError(error, googleId);
      });

      ws.on("close", async () => {
        gameManager.removeUser(googleId);
        console.log(`Client disconnected. ID: ${googleId}`);

        // Publish offline presence
        pub.publish("presence", JSON.stringify({ googleId, isOnline: false }));
        await pub.del(`presence:${googleId}`);
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
