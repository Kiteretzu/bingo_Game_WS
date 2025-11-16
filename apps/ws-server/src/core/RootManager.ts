import { UserId, GameType, GameMessage } from './types';
import { GameTypeEnum, MessageType, GAME_CONFIG } from './constants';
import { UserManager } from '../user/UserManager';
import { BingoManager } from '../games/bingo/BingoManager';
import { WebSocket } from 'ws';
import { Logger } from '../utils/logger';
import { ValidationUtils } from '../utils/validation';
import { WebSocketUtils } from '../utils/websocket';
import { getPlayerData, verifyToken } from '../helpers/helper';
import { matchmakingService } from '@repo/redis/services';
import { REDIS_PlayerFindingMatch } from '@repo/redis/types';
import { 
  PUT_GAME_INIT,
  PUT_CANCEL_GAME_INIT,
  PUT_RESIGN,
  PUT_SEND_EMOTE,
  MessageType as LegacyMessageType
} from '@repo/messages/message';
import { v4 as uuvidv4 } from 'uuid';
import { RootMessageType } from "@repo/messages/v2/message";

export class RootManager {
  private static instance: RootManager;
  
  private userManager: UserManager;
  private gameManagers: Map<GameType, BingoManager>; // BingoManager | MonopolyManager | etc.
  private userToGameType: Map<UserId, GameType>;
  private reconnectionTimeouts: Map<UserId, NodeJS.Timeout>;
  
  private constructor() {
    this.userManager = new UserManager();
    this.gameManagers = new Map();
    this.userToGameType = new Map();
    this.reconnectionTimeouts = new Map();
    
    // Register game managers
    this.gameManagers.set(GameTypeEnum.BINGO, new BingoManager());
    // this.gameManagers.set(GameTypeEnum.MONOPOLY, new MonopolyManager());
    
    Logger.info('RootManager initialized with game managers:', Array.from(this.gameManagers.keys()));
  }
  
  public static getInstance(): RootManager {
    if (!RootManager.instance) {
      RootManager.instance = new RootManager();
    }
    return RootManager.instance;
  }
  
  // User management
  public async addUser(userId: UserId, socket: WebSocket, token?: string): Promise<void> {
    // If token provided, get player data (for backward compatibility)
    if (token) {
      try {
        const playerData = await getPlayerData(token);
        if (playerData) {
          Logger.userConnection(userId, 'CONNECT', 'Player data loaded');
          this.userManager.addUser(userId, socket, playerData);
              this.setupSocketHandlers(socket, userId);
        }
      } catch (error) {
        Logger.error(`Failed to load player data for user ${userId}:`, error);
      }
    }
    
    Logger.userConnection(userId, 'CONNECT');
  }
  
  public removeUser(userId: UserId): void {
    // Clear any pending reconnection timeout
    const timeout = this.reconnectionTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectionTimeouts.delete(userId);
    }
    
    this.userManager.removeUser(userId);
    this.userToGameType.delete(userId);
    
    Logger.userConnection(userId, 'DISCONNECT');
  }
  
  public isUserReconnecting(userId: UserId): boolean {
    // Check if user is in any game
    for (const [gameType, manager] of this.gameManagers.entries()) {
      if (manager.isUserInGame && manager.isUserInGame(userId)) {
        return true;
      }
    }
    return false;
  }
  
  public async reconnectUser(userId: UserId, socket: WebSocket, token: string): Promise<void> {
    // Clear reconnection timeout
    const timeout = this.reconnectionTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectionTimeouts.delete(userId);
    }

    const playerData = await getPlayerData(token);
    if (playerData) {
      Logger.userConnection(userId, 'RECONNECT', 'Player data loaded');
      // Update socket in user manager
      this.userManager.updateUserSocket(userId, socket, playerData);
    }
    
    
    // Find the game user was in and reconnect
    for (const [gameType, manager] of this.gameManagers.entries()) {
      const game = manager.getGameByUserId(userId);
      if (game) {
        game.reconnectPlayer(userId, socket);
        this.setupSocketHandlers(socket, userId);
        Logger.userConnection(userId, 'RECONNECT', `Reconnected to ${gameType} game`);
        return;
      }
    }
    
    Logger.warn(`User ${userId} attempted reconnection but no active game found`);
  }

   // Disconnect handling
  private handleDisconnect(userId: UserId): void {
    Logger.userConnection(userId, 'DISCONNECT');
    
    // Set a timeout to remove user if they don't reconnect
    const timeout = setTimeout(() => {
      if (!this.userManager.isUserConnected(userId)) {
        this.removeUser(userId);
        Logger.info(`User ${userId} removed due to timeout`);
      }
    }, GAME_CONFIG.RECONNECTION_TIMEOUT);
    
    this.reconnectionTimeouts.set(userId, timeout);
  }
  
  
  // Socket event handlers
  private setupSocketHandlers(socket: WebSocket, userId: UserId): void {
    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(userId, socket, message);
      } catch (error) {
        Logger.error('Failed to parse message:', error);
        WebSocketUtils.sendError(socket, 'Invalid message format');
      }
    });
    
    socket.on('close', () => {
      this.handleDisconnect(userId);
    });
    
    socket.on('error', (error) => {
      Logger.error(`Socket error for user ${userId}:`, error);
    });
    
    // Setup heartbeat
    WebSocketUtils.setupHeartbeat(socket, GAME_CONFIG.HEARTBEAT_INTERVAL);
  }
  
  private async handleMessage(userId: UserId, socket: WebSocket, message: any): Promise<void> {
    if (!ValidationUtils.isValidMessage(message)) {
      WebSocketUtils.sendError(socket, 'Invalid message format');
      return;
    }

    const { type, gameType, payload } = message;
    
    Logger.gameAction('', userId, type, payload);

    // validate game type
    if (!gameType || !ValidationUtils.isValidGameType(gameType)) {
      WebSocketUtils.sendError(socket, !gameType ? 'Game type is required' : 'Invalid game type');
      return;
    }
    
    switch (type) {
      case RootMessageType.START_MATCHMAKING:
        await this.startMatchmaking(userId, gameType, payload);
        break;

      case RootMessageType.CANCEL_MATCHMAKING:
        this.cancelMatchmaking(userId, gameType);
        break;

      case RootMessageType.GAME_ACTION:
        this.handleGameAction(userId, gameType, payload);
        break;
        
      case PUT_CANCEL_GAME_INIT:
        this.handleCancelGameInit(userId);
        break;
        
      // case PUT_RESIGN:
      //   this.handleResign(userId, payload);
      //   break;
        
      case PUT_SEND_EMOTE:
        this.handleSendEmote(userId, payload);
        break;
        
      default:
        Logger.warn(`Unknown message type from user ${userId}:`, type);
        WebSocketUtils.sendError(socket, 'Unknown message type');
    }
  }
  
  // Matchmaking
  private async startMatchmaking(userId: UserId, gameType: GameType, payload: any): Promise<void> {
    if (!ValidationUtils.isValidGameType(gameType)) {
      WebSocketUtils.sendError(this.userManager.getSocket(userId)!, 'Invalid game type');
      return;
    }
    
    const manager = this.gameManagers.get(gameType);
    if (!manager) {
      WebSocketUtils.sendError(this.userManager.getSocket(userId)!, 'Game type not supported');
      return;
    }
    
    this.userToGameType.set(userId, gameType);
    manager.addToMatchmakingQueue(userId, payload);
    
    // For Bingo, integrate with existing matchmaking service
    if (gameType === GameTypeEnum.BINGO) {
      try {
        // Get player data from token if available
        const token = payload.token;
        if (token) {
          const playerData = await getPlayerData(token);
          if (playerData) {
            const playerFindMatchData: REDIS_PlayerFindingMatch = {
              id: playerData.user.googleId,
              mmr: playerData.user.bingoProfile.mmr,
              matchTier: payload.matchTier || 'NORMAL',
            };
            matchmakingService.addPlayerToQueue(playerFindMatchData);
            Logger.matchmaking(userId, 'added to queue', gameType);
          }
        }
      } catch (error) {
        Logger.error(`Failed to add user ${userId} to matchmaking:`, error);
      }
    }
    
    WebSocketUtils.sendSuccess(this.userManager.getSocket(userId)!, 'Added to matchmaking queue');
  }
  
  private cancelMatchmaking(userId: UserId, gameType: GameType): void {
    const manager = this.gameManagers.get(gameType);
    if (manager) {
      manager.removeFromMatchmakingQueue(userId);
      this.userToGameType.delete(userId);
      
      // Remove from Redis matchmaking if it's Bingo
      if (gameType === GameTypeEnum.BINGO) {
        // Implementation depends on your matchmaking service
        Logger.matchmaking(userId, 'removed from queue', gameType);
      }
      
      WebSocketUtils.sendSuccess(this.userManager.getSocket(userId)!, 'Removed from matchmaking queue');
    }
  }
  
  // Game actions
  private handleGameAction(userId: UserId, gameType: GameType, payload: any): void {
    const manager = this.gameManagers.get(gameType);
    if (manager) {
      const game = manager.getGameByUserId(userId);
      if (game) {
        game.handleAction(userId, payload);
      } else {
        WebSocketUtils.sendError(this.userManager.getSocket(userId)!, 'Game not found');
      }
    }
  }
  
  
  private handleCancelGameInit(userId: UserId): void {
    this.cancelMatchmaking(userId, GameTypeEnum.BINGO);
  }
  
  private handleResign(userId: UserId, payload: any): void {
    const manager = this.gameManagers.get(GameTypeEnum.BINGO);
    if (manager) {
      const game = manager.getGameByUserId(userId);
      if (game) {
        game.handleAction(userId, { type: 'RESIGN', payload });
      }
    }
  }
  
  private handleSendEmote(userId: UserId, payload: any): void {
    const manager = this.gameManagers.get(GameTypeEnum.BINGO);
    if (manager) {
      const game = manager.getGameByUserId(userId);
      if (game) {
        game.handleAction(userId, { type: 'SEND_EMOTE', payload });
      }
    }
  }
  

  // Game creation (called by matchmaking service)
  public async createBingoGame(player1Id: UserId, player2Id: UserId): Promise<void> {
    Logger.info(`Creating bingo game between ${player1Id} and ${player2Id}`);
    const bingoManager = this.gameManagers.get(GameTypeEnum.BINGO) as BingoManager;
    const player1Socket = this.userManager.getSocket(player1Id);
    const player2Socket = this.userManager.getSocket(player2Id);
    const player1Data = this.userManager.getPlayerData(player1Id);
    const player2Data = this.userManager.getPlayerData(player2Id);
    if (!player1Socket || !player2Socket) {
      Logger.error('Cannot create game: one or both players not connected');
      return;
    }
    
    const game = bingoManager.createGame(player1Id, player2Id, player1Socket, player2Socket, player1Data, player2Data);

    Logger.info(`Created bingo game with players ${player1Id} and ${player2Id}`);
  }
  

}
