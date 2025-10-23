import { GameMessage } from '../core/types';

export class ValidationUtils {
  static isValidMessage(message: any): message is GameMessage {
    return (
      typeof message === 'object' &&
      message !== null &&
      typeof message.type === 'string' &&
      message.type.length > 0
    );
  }

  static isValidUserId(userId: any): userId is string {
    return typeof userId === 'string' && userId.length > 0;
  }

  static isValidGameId(gameId: any): gameId is string {
    return typeof gameId === 'string' && gameId.length > 0;
  }

  static isValidGameType(gameType: any): gameType is string {
    return typeof gameType === 'string' && 
           ['BINGO', 'MONOPOLY', 'CHESS', 'CARDS'].includes(gameType);
  }

  static validateMatchmakingData(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      this.isValidGameType(data.gameType) &&
      (data.preferences === undefined || typeof data.preferences === 'object')
    );
  }

  static validateGameAction(action: any): boolean {
    return (
      typeof action === 'object' &&
      action !== null &&
      typeof action.type === 'string' &&
      typeof action.payload === 'object'
    );
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static isValidBingoValue(value: any): value is number {
    return typeof value === 'number' && value >= 1 && value <= 25;
  }

  static isValidEmote(emote: any): boolean {
    const validEmotes = ['happy', 'sad', 'angry', 'surprised', 'thinking', 'wink'];
    return typeof emote === 'string' && validEmotes.includes(emote);
  }
}
