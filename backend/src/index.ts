import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager

// store this in db (future)
const clients = new Map<string, WebSocket>(); // Map to store WebSocket connections


wss.on('connection', function connection(ws) {
    
    // change it with user id // account
    const id : string = uuidv4()

    clients.set(id, ws);

    console.log('This is the id assigened ', id)
    ws.send(`Session Id, ${id}`)
   gameManager.addUser(ws)

   ws.on('error', console.error);
    ws.on('close', () => {
        clients.delete(id);
        console.log('User removed of id', id) // delete laters
        gameManager.removeUser(ws)})
});