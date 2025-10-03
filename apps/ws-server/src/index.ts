import { getRedisClient, getRedisSubscriberClient } from "@repo/redis/config";
import { verifyToken } from "./helpers/helper";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
// import { STATUS_CODES } from "backend/helpers";
import { gameManager } from "./GameManager";
import { initSubscriptions } from "initPubSub";

let wss: WebSocketServer;

// Create WebSocket Server Logic
async function setupdWebSocket(): Promise<void> {
  const server = http.createServer();
  wss = new WebSocketServer({ server });
  server.listen(4000, () => {
    console.log("WebSocket server listening on port 4000");
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

    console.log("Trying to connect", token);

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
      console.log("onlineGoogleIds", onlineGoogleIds);
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
    STATUS_CODES.WEBSOCKET_SERVER_ERROR || 400, // resolve this
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

setupdWebSocket();
