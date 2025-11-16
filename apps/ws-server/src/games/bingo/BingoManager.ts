import { PlayerData } from "@repo/messages/message";
import { GameId, UserId } from "core/types";
import { IGame } from "games/base/IGame";
import { getPlayerData } from "helpers/helper";
import { v4 as uuidv4 } from "uuid";
import { BingoGame } from "./game";
import WebSocket from "ws";
import { MessageType } from "core/constants";
import { sendPayload } from "helpers/wsSend";

export class BingoManager {

    private games : Map<GameId, BingoGame>;
    private userToGame : Map<UserId, GameId>;
    private matchmakingQueue : Map<UserId, any>; // can be extended later with preferences

    constructor() {
        this.games = new Map();
        this.userToGame = new Map();
        this.matchmakingQueue = new Map();
    }

    static instance: BingoManager;

    static getInstance(): BingoManager {
        if (!BingoManager.instance) {
            BingoManager.instance = new BingoManager();
        }
        return BingoManager.instance;
    }

    getGameByUserId(userId: UserId): BingoGame | null {
        const gameId = this.userToGame.get(userId);
        if (!gameId) return null;
        return this.getGame(gameId);
    }

    // Game management methods would go here
    async createGame(player1: UserId, player2: UserId, player1Socket: WebSocket, player2Socket: WebSocket, player1Data: PlayerData | null, player2Data: PlayerData | null) {

        if (!player1Data) player1Data = await getPlayerData(player1);
        if (!player2Data) player2Data = await getPlayerData(player2);

        const gameId = uuidv4();
        // Create the game instance and add it to the games map
        const game = new BingoGame(gameId, player1Socket, player2Socket, player1Data!, player2Data!);
        this.games.set(gameId, game); // for now
        this.userToGame.set(player1, gameId);
        this.userToGame.set(player2, gameId);

        // Notify players about the game start
        // sendPayload(player1Socket, MessageType.GET_GAME, game.getGameStateForPlayer(player1));
        // sendPayload(player2Socket, MessageType.GET_GAME, game.getGameStateForPlayer(player2));

    }

    getGame(gameId: GameId) : IGame | null {
        return this.games.get(gameId) || null;
    }
    
    getGameByUser(userId: UserId) : IGame | null {
        const gameId = this.userToGame.get(userId);
        if (!gameId) return null;
        return this.getGame(gameId);
    }

    removeGame(gameId: GameId): void {
    const game = this.games.get(gameId);
    if (game) {
      game.cleanup();
      // Remove user mappings
      for (const [userId, gId] of this.userToGame.entries()) {
        if (gId === gameId) {
          this.userToGame.delete(userId);
        }
      }
      this.games.delete(gameId);
    }
  }


    // Matchmaking
  addToMatchmakingQueue(userId: UserId, preferences: any): void {
    this.matchmakingQueue.set(userId, preferences);
  }
  
  removeFromMatchmakingQueue(userId: UserId): void {
    this.matchmakingQueue.delete(userId);
  }
  
  isInMatchmakingQueue(userId: UserId): boolean {
    return this.matchmakingQueue.has(userId);
  }

   getMatchmakingQueue(): Map<UserId, any> {
    return this.matchmakingQueue;
  }  
  // Utility methods
  isUserInGame(userId: UserId): boolean {
    return this.userToGame.has(userId);
  }
  
  getActiveGamesCount(): number {
    return this.games.size;
  }
  
  getMatchmakingQueueSize(): number {
    return this.matchmakingQueue.size;
  }
  
  // Cleanup
  cleanup(): void {
    this.games.forEach(game => game.cleanup());
    this.games.clear();
    this.userToGame.clear();
    this.matchmakingQueue.clear();
  }
}