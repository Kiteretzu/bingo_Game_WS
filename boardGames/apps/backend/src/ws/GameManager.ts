import { WebSocket } from "ws";
import { Game } from "./Game";
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
} from "@repo/games/client/bingo/messages";
import { getPlayerData } from "./helper";
import { redis_newGame } from "@repo/redis-worker/test";

export class GameManager {
  private games: Map<string, Game>; // Number of games going on
  private pendingPlayer: WebSocket | null; // Player 1
  private users: WebSocket[]; // All the existing users playing games
  private pendingPlayerData: PlayerData | null;

  constructor() {
    this.games = new Map();
    this.pendingPlayer = null;
    this.users = [];
    this.pendingPlayerData = null;
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
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

            const playerData: PlayerData = await getPlayerData(token);

            if (!this.pendingPlayer ) {
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
                this.pendingPlayerData !,
                playerData
              );


              this.games.set(newGameId, newGame);
              socket.send(`Game started with ID: ${newGameId}`);
              this.pendingPlayer = null; // Reset pendingUser once the game starts
              this.pendingPlayerData = null; // Reset pendingUserData
            }
            break;
          }

          case PUT_CANCEL_GAME_INIT: {
            console.log("working 🤨");
            const user = this.users.find((user) => user !== socket);
            if (user) {
              this.pendingPlayer = null;
              this.pendingPlayerData = null;
            }
            socket.send("Cancel match find");
            break; // Add break here
          }

          case PUT_CHECK_MARK: {
            const data = message as PAYLOAD_PUT_GET_CHECK_MARK; // Cast message.data to ADD_CHECK_MARK_DATA

            const gameId = data.payload.gameId;
            const value = data.payload.value;
            const game: Game | undefined = this.games.get(gameId);

            if (game) {
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
