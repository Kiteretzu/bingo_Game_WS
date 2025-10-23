import { PlayerData } from '@repo/messages/message';
import { UserId } from '../core/types';
import { WebSocket } from 'ws';

export class UserManager {
  private users: Map<UserId, WebSocket>;
  private socketToUser: Map<WebSocket, UserId>;
  private connectionTimes: Map<UserId, Date>;
  private usersToPlayerData: Map<UserId, PlayerData>; // Optional: Store additional player data if needed
  
  constructor() {
    this.users = new Map();
    this.socketToUser = new Map();
    this.connectionTimes = new Map();
    this.usersToPlayerData = new Map();
  }
  

  static instance: UserManager;

  static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  addUser(userId: UserId, socket: WebSocket, playerData: PlayerData): void {
    this.users.set(userId, socket);
    this.socketToUser.set(socket, userId);
    this.connectionTimes.set(userId, new Date());
    if (playerData) {
      this.usersToPlayerData.set(userId, playerData);
    }
  }
  
  removeUser(userId: UserId): void {
    const socket = this.users.get(userId);
    if (socket) {
      this.socketToUser.delete(socket);
      this.usersToPlayerData.delete(userId);
    }
    this.users.delete(userId);
    this.connectionTimes.delete(userId);
  }
  
  removeUserBySocket(socket: WebSocket): UserId | undefined {
    const userId = this.socketToUser.get(socket);
    if (userId) {
      this.removeUser(userId);
    }
    return userId;
  }
  
  getSocket(userId: UserId): WebSocket | undefined {
    return this.users.get(userId);
  }
  
  getUserId(socket: WebSocket): UserId | undefined {
    return this.socketToUser.get(socket);
  }

  getPlayerData(userId: UserId): PlayerData | undefined {
    return this.usersToPlayerData.get(userId);
  }

  isUserConnected(userId: UserId): boolean {
    return this.users.has(userId);
  }
  
  getConnectionTime(userId: UserId): Date | undefined {
    return this.connectionTimes.get(userId);
  }
  
  getAllUsers(): UserId[] {
    return Array.from(this.users.keys());
  }
  
  getConnectedUserCount(): number {
    return this.users.size;
  }
  
  // Update socket for reconnection
  updateUserSocket(userId: UserId, newSocket: WebSocket, playerData: PlayerData): void {
  const oldSocket = this.users.get(userId);
  if (oldSocket) {
    this.socketToUser.delete(oldSocket);
    if (oldSocket.readyState === WebSocket.OPEN) {
      oldSocket.close(1000, "Reconnected with new socket");
    }
  }

  this.users.set(userId, newSocket);
  this.socketToUser.set(newSocket, userId);
  this.usersToPlayerData.set(userId, playerData);
  this.connectionTimes.set(userId, new Date());
}
  
  // Clean up disconnected sockets
  cleanupDisconnectedSockets(): void {
    const disconnectedUsers: UserId[] = [];
    
    this.users.forEach((socket, userId) => {
      if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
        disconnectedUsers.push(userId);
      }
    });
    
    disconnectedUsers.forEach(userId => {
      this.removeUser(userId);
    });
    
    return disconnectedUsers;
  }
}
