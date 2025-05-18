import {
  ChallengeSchema,
  GET_CHALLENGE,
  MatchHistory,
  Message,
  MessageType,
  PAYLOAD_PUT_CHALLENGE,
  PAYLOAD_PUT_GAME_INIT,
  PAYLOAD_PUT_GET_CHECK_MARK,
  PAYLOAD_PUT_RESIGN,
  PAYLOAD_PUT_SEND_EMOTE,
  PAYLOAD_PUT_TOSS_DECISION,
  PlayerData,
  PlayerGameboardData,
  PUT_CANCEL_GAME_INIT,
  PUT_CHALLENGE,
  PUT_CHECK_MARK,
  PUT_GAME_INIT,
  PUT_RESIGN,
  PUT_SEND_EMOTE,
  PUT_TOSS_DECISION,
} from "@repo/messages/message";
import { gameServices, matchmakingService } from "@repo/redis/services";
import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";
import { REDIS_PlayerFindingMatch } from "../../../../packages/redis/src/types";
import { getPlayerData, verifyToken } from "../helper/";
import { sendPayload } from "../helper/wsSend";
import { Game } from "./game";

type GameId = string;
type UserId = string;
import { getRedisClient } from "@repo/redis/config";

export class GameManager {
  private games: Map<GameId, Game>; // Number of games going on
  private pendingPlayer: WebSocket | null; // Player 1
  private pendingPlayerData: PlayerData | null;
  private challangedGames: Map<string, ChallengeSchema>;
  private usersToGames: Map<UserId, GameId>; // Map of user to game
  private users: Map<UserId, WebSocket>; // Use Map for better performance
  private socketToUserId: Map<WebSocket, UserId>;
  private usersToPlayerData: Map<UserId, PlayerData>;
  private readonly redisClientPromise: Promise<
    Awaited<ReturnType<typeof getRedisClient>>
  >;
  private static instance: GameManager | null = null;

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  constructor() {
    this.pendingPlayer = null;
    this.pendingPlayerData = null;
    this.games = new Map();
    this.usersToGames = new Map();
    this.challangedGames = new Map();
    this.users = new Map();
    this.usersToPlayerData = new Map();
    this.socketToUserId = new Map();

    this.redisClientPromise = getRedisClient();

    this.setUpDataFromRedis();
    //
  }

  async addUser(googleId: string, token: string, socket: WebSocket) {
    // set this to redis also! maybe service
    this.users.set(googleId, socket);
    this.socketToUserId.set(socket, googleId);
    const playerData = await getPlayerData(token);
    const redisClient = await this.redisClientPromise;

    if (playerData) {
      this.usersToPlayerData.set(googleId, playerData);

      // Store in Redis as well
      await redisClient.set(
        `playerData:${googleId}`,
        JSON.stringify(playerData)
      );
    }
    this.addHandler(socket);
  }

  removeUser(googleId: string) {
    const socket = this.users.get(googleId);
    // also removing from pending players
    if (socket == this.pendingPlayer) {
      this.pendingPlayer = null;
      this.pendingPlayerData = null;
    }
    if (socket) {
      this.socketToUserId.delete(socket);
    }
    this.users.delete(googleId);
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
    gameServices.getInstance().removeGame(gameId);
  }
  removeUserToGame(gameId: string) {
    for (const [userId, game_Id] of this.usersToGames.entries()) {
      if (game_Id === gameId) {
        this.usersToGames.delete(userId);
        gameServices.getInstance().removeUserFromGame(userId);
      }
    }
  }
  async setUpDataFromRedis() {
    // fetch all active games (coming in form of all gameIDs)

    const activeGames = await gameServices.getInstance().getAllGames();
    const activeUsers = await gameServices.getInstance().getAllUsersToGames();

    console.log("Active Games came", activeGames.length, activeGames);
    console.log("Active Users came", activeUsers);

    // simulate all games
    for (const game of activeGames) {
      activeGames.map(async (game) => {
        const gameId = game.gameId;
        const playerGameBoardData =
          game.gameboards as unknown as PlayerGameboardData[];
        const tossWinnerId = game.tossWinnerId;
        const matchHistory = game.matchHistory as unknown as MatchHistory;
        const moveCount = game.matchHistory.length;
        const gameStarted = game.isGameStarted;
        const playerData = this.getPlayerData(game.players);
        console.log("this is the gameStarted", gameStarted);
        const newGame = new Game(
          gameId,
          null,
          null,
          playerData[0],
          playerData[1],
          playerGameBoardData,
          matchHistory,
          tossWinnerId,
          gameStarted
        );
        this.games.set(gameId, newGame);
      });
    }

    activeUsers.map((user) => {
      this.usersToGames.set(user.userId, user.gameId as string);
    });
    console.log("end of here");
  }

  getPlayerData(players: any): PlayerData[] {
    const playerData = players.map((player: any) => {
      // any for now!
      console.log("this player in getPLayerData ", player);
      return {
        user: {
          googleId: player.User.googleId,
          displayName: player.User.displayName,
          avatar: player.User.avatar,
          bingoProfile: {
            id: player.id,
            mmr: player.mmr,
            league: player.league,
            wins: player.wins,
            losses: player.losses,
            totalMatches: player.totalMatches,
          },
        },
      };
    });
    return playerData;
  }

  isUserReconnecting(userId: string): boolean {
    // check if userId exists in active games
    if (this.usersToGames.has(userId)) {
      console.log("isRecon true");
      return true;
    } else {
      console.log("isRecon false");
      return false;
    }
  }

  reconnectToGame(userId: string, socket: WebSocket) {
    const gameId = this.usersToGames.get(userId);
    console.log("inside reconnect to game");
    if (gameId) {
      const game = this.games.get(gameId);
      console.log("this is gameId ", game);
      if (game) {
        console.log("found the game");
        game.reconnectPlayer(socket, userId);
      }
    }
  }

  getUserId(socket: WebSocket): UserId | undefined {
    return this.socketToUserId.get(socket);
  }

  getSocket(userId: UserId): WebSocket | undefined {
    return this.users.get(userId);
  }

  public async createMatch(player1_ID: string, player2_ID: string) {
    const redisClient = await this.redisClientPromise;

    let player1Data = this.usersToPlayerData.get(player1_ID);
    if (!player1Data) {
      const cached1 = await redisClient.get(`playerData:${player1_ID}`);
      if (cached1) {
        player1Data = JSON.parse(cached1) as PlayerData;
        this.usersToPlayerData.set(player1_ID, player1Data);
      }
    }
    let player2Data = this.usersToPlayerData.get(player2_ID);
    if (!player2Data) {
      const cached2 = await redisClient.get(`playerData:${player2_ID}`);
      if (cached2) {
        player2Data = JSON.parse(cached2) as PlayerData;
        this.usersToPlayerData.set(player2_ID, player2Data);
      }
    }
    console.log("this is player1Data", player1Data);
    console.log("this is player2Data", player2Data);

    const newGameId = uuidv4(); // Assigning game ID to find games fast
    console.log("GameId: ", newGameId);

    const newGame = new Game(
      newGameId,
      this.getSocket(player1_ID)!,
      this.getSocket(player2_ID)!,
      player1Data!,
      player2Data!
    );

    this.games.set(newGameId, newGame);
    this.usersToGames.set(player1_ID, newGameId);
    this.usersToGames.set(player2_ID, newGameId);
    // store in redis
    gameServices.getInstance().addGame(newGameId);

    gameServices.getInstance().addUserToGame(player1_ID, newGameId);
    gameServices.getInstance().addUserToGame(player2_ID, newGameId);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString()) as Message;
        console.log("this is raw message string", message);
        // Handle different message types
        switch (message.type as MessageType) {
          case PUT_GAME_INIT: {
            const data = message as PAYLOAD_PUT_GAME_INIT;

            console.log("This is the data in gameINIT", data.payload);
            const token = data.payload.token;

            const decodedToken = verifyToken(token);

            let playerData = this.usersToPlayerData.get(decodedToken.googleId);

            // if not stored in server memory, then reFetch based on token
            if (!playerData) {
              playerData = await getPlayerData(token);
              console.log("HAD TO REFETCH PLAYER DATA!");
              this.usersToPlayerData.set(decodedToken.googleId, playerData!);
              return;
            }

            const playerFindMatchData: REDIS_PlayerFindingMatch = {
              id: playerData.user.googleId,
              mmr: playerData.user.bingoProfile.mmr,
              matchTier: data.payload.matchTier,
              // soon ad gameType also => data.payload.gameType
            };

            matchmakingService.addPlayerToQueue(playerFindMatchData);
            break;
          }

          case PUT_CANCEL_GAME_INIT: {
            console.log("working 🤨");
            const userSocket = this.users.get(
              this.pendingPlayerData!.user.googleId
            );
            this.usersToPlayerData.delete(
              this.pendingPlayerData!.user.googleId
            );

            matchmakingService.removePlayerFromQueue({
              id: user,
              mmr: this.pendingPlayerData!.user.bingoProfile.mmr,
              matchTier: this.pendingPlayerData!.user.matchTier,
            });
            if (user) {
              this.pendingPlayer = null;
              this.pendingPlayerData = null;
            }

            socket.send("Cancel match find");
            // remove from redis
            break; // Add break here
          }

          case PUT_CHECK_MARK: {
            const data = message as PAYLOAD_PUT_GET_CHECK_MARK; // Cast message.data to ADD_CHECK_MARK_DATA
            let game: Game | undefined;
            const gameId = data.payload.gameId;
            const value = data.payload.value;
            // first check in server memory
            game = this.games.get(gameId);

            if (game) {
              console.log("markingCheck in manager");
              game.addCheck(socket, value);
            } else {
              console.error("Error finding the game ID");
              socket.send("Game ID not found");
            }
            break;
          }

          case PUT_RESIGN: {
            const data = message as PAYLOAD_PUT_RESIGN; // Cast message.data to ADD_CHECK_MARK_DATA

            const gameId = data.payload.gameId;
            const game: Game | undefined = this.games.get(gameId);
            if (game) {
              game.resign(socket);
            }
            break;
          }

          case PUT_SEND_EMOTE: {
            const data = message as PAYLOAD_PUT_SEND_EMOTE;
            const gameId = data.payload.gameId;
            const game: Game | undefined = this.games.get(gameId);
            if (game) {
              game.sendEmote(socket, data.payload.emote);
            }
            break;
          }
          // test Pending
          case PUT_CHALLENGE: {
            const data = message as PAYLOAD_PUT_CHALLENGE;
            data.payload.challangeId = uuidv4();
            this.challangedGames.set(data.payload.challangeId, data.payload);

            const receiverSocket = this.users.get(data.payload.receiverId);
            if (!receiverSocket) {
              socket.send("User not online");
              return;
            }
            sendPayload(receiverSocket, GET_CHALLENGE, data.payload);
            break;
          }

          case PUT_TOSS_DECISION: {
            const data = message as PAYLOAD_PUT_TOSS_DECISION;
            const gameId = this.usersToGames.get(
              this.getUserId(socket) as string
            ) as string;
            console.log("this is gameId 🥲", gameId);
            const game: Game | undefined = this.games.get(gameId);
            if (game) {
              console.log("game is found ");
              game.tossDecision(socket, data.payload.decision);
            } else {
              console.error("Error finding the game ID");
              socket.send("Game ID not found");
            }
            break;
          }
          default:
            socket.send("Unknown message type");
        }
      } catch (error) {
        console.error("Failed to process message:", error);
        socket.send("Error processing message");
      }
    });
  }
}

export const gameManager = GameManager.getInstance();
