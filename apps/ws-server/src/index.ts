import { getRedisClient, getRedisSubscriberClient } from "@repo/redis/config";
import { verifyToken } from "./helpers/helper";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { RootManager } from "./core/RootManager";
import { initSubscriptions } from "initPubSub";
import { Logger } from "./utils/logger";
import { WebSocketUtils } from "./utils/websocket";

let wss: WebSocketServer;
let rootManager: RootManager;

// Create WebSocket Server Logic
async function setupdWebSocket(): Promise<void> {
  const server = http.createServer();
  wss = new WebSocketServer({ server });
  rootManager = RootManager.getInstance();
  
  server.listen(4000, () => {
    Logger.info("WebSocket server listening on port 4000");
  });

  await initSubscriptions();
  
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

    Logger.info("New connection attempt", { token: token ? "provided" : "missing" });

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

      // Check if user is reconnecting to an existing game
      if (rootManager.isUserReconnecting(googleId)) {
        Logger.info(`User ${googleId} is reconnecting to existing game`);
        await rootManager.reconnectUser(googleId, ws, token);
      } else {
        // New connection
        Logger.info(`New user connection: ${googleId}`);
        await rootManager.addUser(googleId, ws, token);
      }

      // Send connection confirmation
      WebSocketUtils.sendSuccess(ws, "Successfully connected to game server");

      // Send presence snapshot
      const keys = await pub.keys("presence:*");
      const onlineGoogleIds = keys.map((k) => k.replace("presence:", ""));
      
      WebSocketUtils.sendMessage(ws, {
        type: "presence-snapshot",
        onlineUsers: onlineGoogleIds,
      });

      // Publish online presence
      pub.publish("presence", JSON.stringify({ googleId, isOnline: true }));
      await pub.set(`presence:${googleId}`, "true");

      ws.on("error", (error: Error) => {
        handleWebSocketError(error, googleId);
      });

      ws.on("close", async () => {
        Logger.info(`Client disconnected: ${googleId}`);
        
        // Publish offline presence
        pub.publish("presence", JSON.stringify({ googleId, isOnline: false }));
        await pub.del(`presence:${googleId}`);
        
        // Note: Don't immediately remove user - let RootManager handle reconnection timeout
      });
      
    } catch (error) {
      Logger.error("Connection error:", error);
      ws.close(1008, "Unauthorized: Invalid token or token expired");
    }
  });

  Logger.info("WebSocket server is running!");
}

function handleWebSocketError(error: Error, googleId: string): void {
  Logger.error(`Error from client ${googleId}:`, error.message);
  
  // You can add custom error handling here
  // For now, just log the error
}

export function getWebSocketServer(): WebSocketServer {
  if (!wss) {
    throw new Error("WebSocket server is not initialized");
  }
  return wss;
}

export function getRootManager(): RootManager {
  if (!rootManager) {
    throw new Error("RootManager is not initialized");
  }
  return rootManager;
}

setupdWebSocket();