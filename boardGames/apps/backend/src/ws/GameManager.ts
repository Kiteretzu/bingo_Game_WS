import { WebSocket } from "ws";
import { Game } from "./Game";
import { v4 as uuidv4 } from "uuid";
import { sendPayload } from "../helper/wsSend";
import { GET_RESPONSE, Message, MessageType, PAYLOAD_PUT_GET_CHECK_MARK, PAYLOAD_PUT_GAME_INIT, PUT_CANCEL_GAME_INIT, PUT_CHECK_MARK, PUT_GAME_INIT, RESPONSE_WAITING_PLAYER } from "@repo/games/client/bingo/messages";

export class GameManager {
  private games: Map<string, Game>; // Number of games going on
  private pendingUser: WebSocket | null; // Player 1
  private users: WebSocket[]; // All the existing users playing games
  private pendingUserData: string;

  constructor() {
    this.games = new Map();
    this.pendingUser = null;
    this.users = [];
    this.pendingUserData = "";
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString()) as Message;
        console.log('this is raw message string', message)
        // Handle different message types
        switch (message.type as MessageType) {
          case PUT_GAME_INIT: {
            const data = message as PAYLOAD_PUT_GAME_INIT
            if (!this.pendingUser) {
              this.pendingUser = socket;
              this.pendingUserData = data.payload.data as string; // for now
              sendPayload(socket, GET_RESPONSE, RESPONSE_WAITING_PLAYER )
            }  
           else{
              if(this.pendingUser == socket) {
                return
              }
              const newGameId = uuidv4(); // Assigning game ID to find games fast
              console.log("GameId: ", newGameId);
              const newGame = new Game(
                newGameId,
                this.pendingUser,
                socket,
                this.pendingUserData,
                data.payload.data
              );
              this.games.set(newGameId, newGame);
              socket.send(`Game started with ID: ${newGameId}`);
              this.pendingUser = null; // Reset pendingUser once the game starts
              this.pendingUserData = ""; // Reset pendingUserData
            }
            break;
          }

          case PUT_CANCEL_GAME_INIT: {
            console.log('working 🤨',)
            const user = this.users.find((user) => user !== socket);
            if (user) {
              this.pendingUser = null;
              this.pendingUserData = "";
            }
            socket.send("Cancel match find")
            break; // Add break here
          }

          case PUT_CHECK_MARK: {
            const data = message as PAYLOAD_PUT_GET_CHECK_MARK; // Cast message.data to ADD_CHECK_MARK_DATA
            const id = data.payload.gameId;
            const value = data.payload.value
            const game: Game | undefined = this.games.get(id);

            if (game) {
              game.addCheck(socket, value);
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