import { WebSocket } from "ws";
import { Game } from "@repo/games/bingo";
import { v4 as uuidv4 } from "uuid";
import { sendPayload } from "../helper/wsSend";
import {
  GET_RESPONSE,
  Message,
  MessageType,
  PAYLOAD_PUT_GET_CHECK_MARK,
  PAYLOAD_PUT_GAME_INIT,
  PUT_CANCEL_GAME_INIT,
  PUT_CHECK_MARK,
  PUT_GAME_INIT,
  RESPONSE_WAITING_PLAYER,
  PUT_RESIGN,
  PAYLOAD_PUT_RESIGN,
  PlayerData,
  PUT_SEND_EMOTE,
  PAYLOAD_PUT_SEND_EMOTE,
  GameBoard,
  PAYLOAD_PUT_CHALLENGE,
  ChallengeSchema,
  PUT_CHALLENGE,
  GET_CHALLENGE,
  PUT_ADD_FRIEND,
  PAYLOAD_PUT_ADD_FRIEND,
  GET_ADD_FRIEND,
} from "@repo/games/mechanics";
import { amazing, getPlayerData } from "../helper/";
import { redis_newGame, redis_sentFriendRequest } from "@repo/redis/helper";
import { gameServices } from "@repo/redis/services";
import { Socket } from "dgram";

type GameId = string;
type UserId = string;

export class GameManager {
  // just redis it
  private static readonly instance: GameManager = new GameManager();
  private games: Map<GameId, Game>; // Number of games going on
  private pendingPlayer: WebSocket | null; // Player 1
  private pendingPlayerData: PlayerData | null;
  private challangedGames: Map<string, ChallengeSchema>;
  private usersToGames: Map<UserId, GameId>; // Map of user to game
  private users: Map<UserId, WebSocket>; // Use Map for better performance
  private socketToUserId: Map<WebSocket, UserId>;

  public static getInstance(): GameManager {
    return GameManager.instance;
  }

  constructor() {
    this.pendingPlayer = null;
    this.pendingPlayerData = null;
    this.games = new Map();
    this.usersToGames = new Map();
    this.challangedGames = new Map();
    this.users = new Map();
    this.socketToUserId = new Map();
    this.setUpDataFromRedis();
    //
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }
  removeUserToGame(gameId: string) {
    for (const [userId, game_Id] of this.usersToGames.entries()) {
      if (game_Id === gameId) {
        this.usersToGames.delete(userId);
      }
    }
  }
  async setUpDataFromRedis() {
    // get all games from redis
    console.log("HELLOWW!!!!");
    // const results = amazing();

    // creating new games
    // (await results).forEach((game) => {
    //   const [
    //     gameId,
    //     player1_Data,
    //     player2_Data,
    //     p1_gameBoard,
    //     p2_gameBoard,
    //     moveCount,
    //   ] = game;
    //   const newGame = new Game(
    //     gameId as string,
    //     null,
    //     null,
    //     player1_Data as PlayerData,
    //     player2_Data as PlayerData,
    //     moveCount as number,
    //     [p1_gameBoard as GameBoard, p2_gameBoard as GameBoard]
    //   );
    //   this.games.set(gameId as GameId, newGame);
    // });

    // console.log("THIS IS THE GAME MAP!", this.games);

    // const games = await gameServices.getAllGames();
    // games.forEach((game) => {
    //   const [player1_Data, player2_Data] = formatToPlayersData(game)
    //   const newGame = new Game(
    //     game.gameId,
    //     null,
    //     null,
    //     player1_Data,
    //     player2_Data,

    //   );
    //   this.games.set(game.gameId, newGame);

    // });

    // // get all usersToGames from redis
    // const usersToGames = await gameServices.getAllUsersToGames();
    // usersToGames.forEach((userToGame) => {
    //   this.usersToGames.set(userToGame.userId, userToGame.gameId);
    // });

    // console.log('THIS IS USER2GAMES', this.usersToGames)
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
      if (game) {
        game.reconnectPlayer(socket, userId);
      }
    }
  }

  addUser(googleId: string, socket: WebSocket) {
    this.users.set(googleId, socket);
    this.socketToUserId.set(socket, googleId);

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

  getUserId(socket: WebSocket): UserId | undefined {
    return this.socketToUserId.get(socket);
  }

  getSocket(userId: UserId): WebSocket | undefined {
    return this.users.get(userId);
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

            const token = data.payload.token;

            const playerData: PlayerData | null = await getPlayerData(token);
            if (!playerData) {
              sendPayload(socket, GET_RESPONSE);
              return;
            }

            if (!this.pendingPlayer) {
              this.pendingPlayer = socket;
              this.pendingPlayerData = playerData;

              sendPayload(socket, GET_RESPONSE, RESPONSE_WAITING_PLAYER);
            } else {
              if (this.pendingPlayer == socket) {
                return;
              }
              const newGameId = uuidv4(); // Assigning game ID to find games fast
              console.log("GameId: ", newGameId);
              const newGame = new Game(
                newGameId,
                this.pendingPlayer,
                socket,
                this.pendingPlayerData!,
                playerData
              );

              // store in games map
              this.games.set(newGameId, newGame);
              this.usersToGames.set(
                this.pendingPlayerData!.user.googleId,
                newGameId
              );
              this.usersToGames.set(playerData.user.googleId, newGameId);
              // store in redis
              // gameServices.addGame(newGameId);
              // gameServices.addUserToGame(
              //   this.pendingPlayerData!.user.googleId,
              //   this.pendingPlayerData!
              // );
              // gameServices.addUserToGame(playerData.user.googleId, playerData);

              this.pendingPlayer.send(`Game started with ID: ${newGameId}`);
              socket.send(`Game started with ID: ${newGameId}`);
              this.pendingPlayer = null; // Reset pendingUser once the game starts
              this.pendingPlayerData = null; // Reset pendingUserData
            }
            break;
          }

          case PUT_CANCEL_GAME_INIT: {
            console.log("working 🤨");
            const user = this.users.get(this.pendingPlayerData!.user.googleId);
            if (user) {
              this.pendingPlayer = null;
              this.pendingPlayerData = null;
            }
            socket.send("Cancel match find");
            break; // Add break here
          }

          case PUT_CHECK_MARK: {
            const data = message as PAYLOAD_PUT_GET_CHECK_MARK; // Cast message.data to ADD_CHECK_MARK_DATA
            let game: Game | undefined;
            const gameId = data.payload.gameId;
            const value = data.payload.value;
            // first check in server memory
            game = this.games.get(gameId);

            // if not found in server memory, check in redis
            // if (!game) {
            //   // Find the reasonm
            //   const response = await gameServices.getGame(gameId);
            //   const wao; // figure out socket
            //   const wao2; // figure out socket
            //   const playerData: PlayerData = {
            //     user: {
            //       googleId: response?.players[0].User.googleId!,
            //       displayName: response?.players[0].User.displayName!,
            //       avatar: response?.players[0].User.avatar!,
            //       bingoProfile: {
            //         id: response?.players[0].id!,
            //         mmr: response?.players[0].mmr!,
            //         league: response?.players[0].league!,
            //         wins: response?.players[0].wins!,
            //         losses: response?.players[0].losses!,
            //         totalMatches: response?.players[0].totalMatches!,
            //       },
            //     },
            //   };
            //   this.games.set(
            //     gameId,
            //     new Game(
            //       gameId,
            //       wao as WebSocket,
            //       wao2 as WebSocket,
            //       playerData,
            //       playerData
            //     )
            //   );
            // }

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

          case PUT_ADD_FRIEND: {
            const data = message as PAYLOAD_PUT_ADD_FRIEND;
            const fromGoogleId = this.getUserId(socket); // this will def come
            console.log("this is fromUserGoogleId", fromGoogleId);
            console.log(`Thi is payload data`, data.payload.to);
            // save to DB
            redis_sentFriendRequest({
              from: fromGoogleId!,
              to: data.payload.to,
            });

            const receiverSocket = this.users.get(data.payload.to);
            // tell redis to sent request in db
            if (!receiverSocket) {
              socket.send("User not online");
              return;
            }
            sendPayload(receiverSocket, GET_ADD_FRIEND, data.payload);
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
