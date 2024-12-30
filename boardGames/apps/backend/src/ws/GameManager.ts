import { WebSocket } from "ws";
import { Game } from "./Game";
import {
  ADD_CHECK_MARK,
  ADD_CHECK_MARK_DATA,
  CANCEL_GAME_INIT,
  GAME_INIT,
  Message,
  MessageType,
} from "@repo/games/messages";
import { v4 as uuidv4 } from "uuid";

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

        // Handle different message types
        switch (message.type as MessageType) {
          case GAME_INIT: {
            if (!this.pendingUser) {
              console.log("INSIDE CASE 🥲");
              this.pendingUser = socket;
              this.pendingUserData = message.data as string;
              socket.send("Waiting for another player...");
            }  
           else{
              if(this.pendingUser == socket) {
                return
              }
              console.log('else also working? ❤️',)
              const newGameId = uuidv4(); // Assigning game ID to find games fast
              console.log("GameId: ", newGameId);
              const newGame = new Game(
                newGameId,
                this.pendingUser,
                socket,
                this.pendingUserData,
                message.data as string
              );
              this.games.set(newGameId, newGame);
              socket.send(`Game started with ID: ${newGameId}`);
              this.pendingUser = null; // Reset pendingUser once the game starts
              this.pendingUserData = ""; // Reset pendingUserData
            }
            break;
          }

          case CANCEL_GAME_INIT: {
            console.log('working 🤨',)
            const user = this.users.find((user) => user !== socket);
            if (user) {
              this.pendingUser = null;
              this.pendingUserData = "";
            }
            socket.send("Cancel match find")
            break; // Add break here
          }

          case ADD_CHECK_MARK: {
            const data = message.data as ADD_CHECK_MARK_DATA; // Cast message.data to ADD_CHECK_MARK_DATA
            const id = data.gameId;
            const game: Game | undefined = this.games.get(id);

            if (game) {
              game.addCheck(socket, data.value);
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