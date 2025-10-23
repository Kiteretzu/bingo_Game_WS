import { WebSocket } from 'ws';

export class WebSocketUtils {
  static isSocketOpen(socket: WebSocket): boolean {
    return socket.readyState === WebSocket.OPEN;
  }

  static isSocketClosed(socket: WebSocket): boolean {
    return socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING;
  }

  static sendMessage(socket: WebSocket, message: any): boolean {
    if (this.isSocketOpen(socket)) {
      try {
        socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        return false;
      }
    }
    return false;
  }

  static sendError(socket: WebSocket, error: string): void {
    this.sendMessage(socket, { type: 'ERROR', message: error });
  }

  static sendSuccess(socket: WebSocket, message: string, data?: any): void {
    this.sendMessage(socket, { type: 'SUCCESS', message, data });
  }

  static closeConnection(socket: WebSocket, code?: number, reason?: string): void {
    if (this.isSocketOpen(socket)) {
      socket.close(code, reason);
    }
  }

  static setupHeartbeat(socket: WebSocket, interval: number = 30000): NodeJS.Timeout {
    return setInterval(() => {
      if (this.isSocketOpen(socket)) {
        this.sendMessage(socket, { type: 'PING' });
      }
    }, interval);
  }

  static setupPongHandler(socket: WebSocket): void {
    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'PONG') {
          // Heartbeat received, connection is alive
          return;
        }
      } catch (error) {
        // Not a JSON message or ping/pong, handle normally
      }
    });
  }
}
