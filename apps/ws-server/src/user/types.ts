import { UserId } from '../core/types';

export interface UserSession {
  userId: UserId;
  connectedAt: Date;
  lastActivity: Date;
  gameId?: string;
  gameType?: string;
}

export interface UserStats {
  userId: UserId;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  averageGameTime: number;
}
