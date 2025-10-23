export type UserId = string;
export type GameId = string;
export type GameType = 'BINGO' | 'MONOPOLY' | 'CHESS' | 'CARDS';

export interface UserConnection {
  userId: UserId;
  socket: WebSocket;
  connectedAt: Date;
  lastActivity: Date;
}

export interface GameMetadata {
  gameId: GameId;
  gameType: GameType;
  playerIds: UserId[];
  createdAt: Date;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface GameMessage {
  type: string;
  gameType?: GameType;
  payload?: any;
}

export interface MatchmakingData {
  userId: UserId;
  gameType: GameType;
  preferences?: any;
}

// Import WebSocket type for the interface
import { WebSocket } from "ws";
