import { WebSocket } from "ws";
import { Game } from "./Game";
import { ADD_CHECK_MARK, ADD_CHECK_MARK_DATA, GAME_INIT, Message, MessageType } from "./messages";
import { v4 as uuidv4 } from 'uuid';


export class GameManager {
  private games : Map<string, Game>; // no of games going on
  private pendingUser: WebSocket | null; // player1
  private users: WebSocket[]; // all the existed users playing games

  constructor() {
    this.games = new Map()
    this.pendingUser = null;
    this.users = [];
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
      const message = JSON.parse(data.toString()) as Message


      switch(message.type as MessageType){
        case GAME_INIT : {
          if(!this.pendingUser) {
            this.pendingUser = socket
          }
          else {
            const newGameId = uuidv4() // assigning game id to find games fast
           
            console.log('GameId: ', newGameId)
            const newGame = new Game(newGameId, this.pendingUser, socket)
            this.games.set(newGameId, newGame)
          }
          break;
        }
        case ADD_CHECK_MARK : {
          const data = message.data as ADD_CHECK_MARK_DATA; // Cast message.data to AddCheckMarkData

          const id = data.gameId;
          const game: Game | undefined = this.games.get(id)
          
          if (game) {
          game.addCheck(socket, data.value);
          }
          else {
            console.error('Error finding the game id')
            socket.send("Game id not found")
          }

        }
      }
    });
  }
}
