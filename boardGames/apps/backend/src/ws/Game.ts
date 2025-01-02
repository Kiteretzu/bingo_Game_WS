import { WebSocket } from "ws";
import { Box, BoxesValue,GET_RESPONSE, GET_GAME,  PAYLOAD_GET_GAME, PUT_CHECK_MARK, GET_CHECKBOXES, PAYLOAD_PUT_GET_CHECK_MARK, GET_CHECK_MARK } from "@repo/games/client/bingo/messages";
import { Bingo } from "@repo/games/bingo"
import { sendPayload } from "../helper/wsSend";

export class Game {
  public gameId: string;
  public player1: WebSocket;
  public player2: WebSocket;
  private player1_Data: string;
  private player2_Data: string;
  private player1_GameBoard: Bingo;
  private player2_GameBoard: Bingo;
  private players: WebSocket[];
  private gameBoards: Bingo[];
  private moveCount: number

  constructor(id: string, player1: WebSocket, player2: WebSocket, p1_data:string, p2_data:string) {
    this.gameId = id;
    this.moveCount = 1;
    this.player1 = player1;
    this.player2 = player2;

    this.player1_Data = p1_data
    this.player2_Data = p2_data
    this.player1_GameBoard = new Bingo();
    this.player2_GameBoard = new Bingo();

    console.log('player1 data', this.player1_Data)
    console.log('player2 data', this.player2_Data)

    // putting things assigend values array
    this.players = [player1, player2];
    this.gameBoards = [this.player1_GameBoard, this.player2_GameBoard];


    // Send game info
    this.players.forEach((player, index) => {

      const sending_game_data : PAYLOAD_GET_GAME = {
        type: GET_GAME,
        payload: {
      gameId: this.gameId,
      players: [this.player1_Data, this.player2_Data],
      gameBoard: this.gameBoards[index].getGameBoard()
        }
      }
    sendPayload(player, GET_GAME, sending_game_data)
  
    });
  } 

addCheck(currentPlayer: WebSocket, value: BoxesValue) {
    
  if (Number(value) > 25) {
    sendPayload(currentPlayer, GET_RESPONSE, "Value should be less than 25");
    return;
  }

  const isPlayer1 = currentPlayer === this.player1;
  const isPlayer2 = currentPlayer === this.player2;
  const isPlayer1Turn = this.moveCount % 2 === 1 && isPlayer1;
  const isPlayer2Turn = this.moveCount % 2 === 0 && isPlayer2;

  if (!(isPlayer1Turn || isPlayer2Turn)) {
    sendPayload(currentPlayer, GET_RESPONSE, "Please wait for your turn");
    return;
  }

  try {
    // Apply the check mark to the appropriate player's board
    this.gameBoards.forEach((gameBoard) => gameBoard.addCheckMark(value));

    // Send the check mark data to the opponent
    const data: PAYLOAD_PUT_GET_CHECK_MARK = {
      type: GET_CHECK_MARK,
      payload: {
        gameId: this.gameId,
        value,
      }
    };
    
    const waitingPlayer = isPlayer1 ? this.player2 : this.player1;
    sendPayload(waitingPlayer, data.type, data);

    
    
    this.players.forEach((player, index) => {

        const data = {
            checkedBoxes: this.gameBoards[index].getCheckBoxes(),
            checkedLines: this.gameBoards[index].getLineCheckBoxes()
        } 
        sendPayload(player, GET_CHECKBOXES, data)
    });

    // Increment the move count
    this.moveCount++;
  } catch (error: any) {
    sendPayload(currentPlayer, GET_RESPONSE, error.message);
  }
}
}
