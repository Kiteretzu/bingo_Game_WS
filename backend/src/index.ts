import http from 'http'
import express from "express";
import { setupWebSocket } from "./ws/websocket";

const app = express()

// Create HTTP server
const server = http.createServer(app);

setupWebSocket(server);

// Start server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});