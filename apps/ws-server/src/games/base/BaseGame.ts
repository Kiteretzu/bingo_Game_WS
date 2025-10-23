import { UserId, GameId, GameType } from '../../core/types';
import { IGame } from './IGame';
import { WebSocket } from 'ws';

export abstract class BaseGame implements IGame {
  protected players: Map<UserId, WebSocket>;
  protected gameState: any;
  protected createdAt: Date;
  protected status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' = 'WAITING';
  
  constructor(
    public gameId: GameId,
    public gameType: GameType
  ) {
    this.players = new Map();
    this.createdAt = new Date();
  }
  
  // Core player management
  addPlayer(userId: UserId, socket: WebSocket): void {
    this.players.set(userId, socket);
    this.onPlayerAdded(userId, socket);
    
    // Check if game can start
    if (this.canStart() && this.status === 'WAITING') {
      this.status = 'IN_PROGRESS';
      this.start();
    }
  }
  
  removePlayer(userId: UserId): void {
    this.players.delete(userId);
    this.onPlayerRemoved(userId);
    
    // Check if game should end
    if (this.players.size === 0) {
      this.status = 'COMPLETED';
      this.end();
    }
  }
  
  reconnectPlayer(userId: UserId, socket: WebSocket): void {
    this.players.set(userId, socket);
    this.sendGameState(socket);
    this.onPlayerReconnected(userId, socket);
  }
  
  // Utility methods
  isPlayerInGame(userId: UserId): boolean {
    return this.players.has(userId);
  }
  
  getPlayerSocket(userId: UserId): WebSocket | undefined {
    return this.players.get(userId);
  }
  
  getAllPlayers(): UserId[] {
    return Array.from(this.players.keys());
  }
  
  getPlayerCount(): number {
    return this.players.size;
  }
  
  // Abstract methods that each game must implement
  abstract start(): void;
  abstract end(): void;
  abstract getState(): any;
  abstract setState(state: any): void;
  abstract canStart(): boolean;
  abstract isGameOver(): boolean;
  abstract handleAction(userId: UserId, action: any): void;
  
  // Hooks for game-specific logic
  protected abstract onPlayerAdded(userId: UserId, socket: WebSocket): void;
  protected abstract onPlayerRemoved(userId: UserId): void;
  protected abstract onPlayerReconnected(userId: UserId, socket: WebSocket): void;
  protected abstract sendGameState(socket: WebSocket): void;
  
  // Common cleanup
  cleanup(): void {
    this.players.clear();
    this.status = 'COMPLETED';
  }
  
  // Broadcast to all players
  protected broadcast(message: any): void {
    this.players.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    });
  }
  
  // Broadcast to specific player
  protected sendToPlayer(userId: UserId, message: any): void {
    const socket = this.players.get(userId);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }
  
  // Broadcast to all players except one
  protected broadcastExcept(userId: UserId, message: any): void {
    this.players.forEach((socket, playerId) => {
      if (playerId !== userId && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    });
  }
}
