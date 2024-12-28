import { WebSocketServer, WebSocket } from 'ws';
import { GameManager } from './GameManager';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';

interface ClientsMap {
    [key: string]: WebSocket; // Map of client IDs to WebSocket instances
}

// Create WebSocket Server Logic
export function setupWebSocket(server: Server): void {
    const wss = new WebSocketServer({ server });
    const gameManager = new GameManager();
    const clients: ClientsMap = {}; // Object to store WebSocket connections

    wss.on('connection', (ws: WebSocket) => {
        const id = uuidv4(); // Generate a unique ID for each connection
        clients[id] = ws;

        console.log('New client connected. Assigned ID:', id);
        ws.send(`Your session ID: ${id}`);
        gameManager.addUser(ws);

        // Handle messages
        ws.on('message', (message: string) => {
            console.log(`Received from ${id}:`, message);
            // Handle game logic here...
        });

        // Handle errors
        ws.on('error', (error: Error) => {
            console.error(`Error from client ${id}:`, error.message);
        });

        // Handle disconnection
        ws.on('close', () => {
            delete clients[id];
            gameManager.removeUser(ws);
            console.log('Client disconnected. ID:', id);
        });
    });

    console.log('WebSocket server is running!');
}