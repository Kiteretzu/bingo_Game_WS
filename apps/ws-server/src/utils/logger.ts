export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static currentLevel: LogLevel = LogLevel.INFO;

  static setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  static debug(message: string, ...args: any[]): void {
    if (this.currentLevel <= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]): void {
    if (this.currentLevel <= LogLevel.INFO) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    if (this.currentLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  static error(message: string, ...args: any[]): void {
    if (this.currentLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }

  static gameAction(gameId: string, userId: string, action: string, ...args: any[]): void {
    this.info(`[GAME:${gameId}] User ${userId} performed action: ${action}`, ...args);
  }

  static userConnection(userId: string, action: 'CONNECT' | 'DISCONNECT' | 'RECONNECT', ...args: any[]): void {
    this.info(`[USER:${userId}] ${action}`, ...args);
  }

  static matchmaking(userId: string, action: string, gameType: string, ...args: any[]): void {
    this.info(`[MATCHMAKING] User ${userId} ${action} for ${gameType}`, ...args);
  }
}
