import { WebSocketServer, WebSocket } from 'ws';
import { GameManager } from './GameManager';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';
import { CustomError } from '../helper/customError';  // Assuming CustomError class is defined
import { STATUS_CODES } from '../errors';
import { Socket } from 'dgram';

interface ClientsMap {
    [key: string]: WebSocket; // Map of client IDs to WebSocket instances
}

let wss: WebSocketServer

// Create WebSocket Server Logic
export function setupWebSocket(server: Server): void {
    wss = new WebSocketServer({ server });
    const gameManager = new GameManager();
    const clients: ClientsMap = {}; // Object to store WebSocket connections
    console.log('in here ws')
    wss.on('connection', (ws: WebSocket) => {
        const id = uuidv4(); // Generate a unique ID for each connection
        clients[id] = ws;

        console.log('New client connected. Assigned ID:', id);
        ws.send(`Your session ID: ${id}`);
           gameManager.addUser(ws)


        ws.on('error', (error: Error) => {
            console.error(`Error from client ${id}:`, error.message);
            // Using CustomError to handle the error (but not throw it here directly)
            const customError = new CustomError("Unable to initialize Express app",STATUS_CODES.WEBSOCKET_SERVER_ERROR , 'WEBSOCKET_SERVER_ERROR');
            // Log the error or take further actions here
            console.error(customError);
        });

        // Handle WebSocket disconnection
        ws.on('close', () => {
            delete clients[id];
            gameManager.removeUser(ws);
            console.log('Client disconnected. ID:', id);
        });
    });

    console.log('WebSocket server is running!');
}

export function getWebSocketServer(): WebSocketServer {
    if (!wss) {
        throw new Error("WebSocket server is not initialized");
    }
    return wss;
}