import { UserId, GameId, GameType } from '../../core/types';
import { WebSocket } from 'ws';

export interface IGame {
  gameId: GameId;
  gameType: GameType;
  
  // Core game methods
  addPlayer(userId: UserId, socket: WebSocket): void;
  removePlayer(userId: UserId): void;
  reconnectPlayer(userId: UserId, socket: WebSocket): void;
  
  // Game state
  getState(): any;
  setState(state: any): void;
  
  // Lifecycle
  start(): void;
  end(): void;
  cleanup(): void;
  
  // Checks
  isPlayerInGame(userId: UserId): boolean;
  canStart(): boolean;
  isGameOver(): boolean;
  
  // Game actions
  handleAction(userId: UserId, action: any): void;
}
