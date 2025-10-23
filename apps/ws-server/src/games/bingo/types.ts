import { UserId, GameId } from '../../core/types';

export interface BingoGameState {
  gameId: GameId;
  players: BingoPlayer[];
  currentTurn: UserId;
  gameBoard: number[][];
  checkedBoxes: Set<number>;
  isGameStarted: boolean;
  isGameOver: boolean;
  winner?: UserId;
  gameEndMethod?: 'BINGO' | 'RESIGNATION' | 'ABANDON';
}

export interface BingoPlayer {
  userId: UserId;
  playerBoard: number[][];
  checkedBoxes: Set<number>;
  linesCompleted: number;
  isActive: boolean;
  playerData: any; // PlayerData from existing system
}

export interface BingoAction {
  type: 'CHECK_BOX' | 'RESIGN' | 'SEND_EMOTE' | 'TOSS_DECISION';
  payload: any;
}

export interface BingoPreferences {
  matchTier?: string;
  gameMode?: string;
}
