import { WebSocket } from "ws";
import { BoxesValue, GameBoard } from "./util/gameBoards";
import { Bingo } from "./util";
import { ADD_CHECK_MARK, ADD_CHECK_MARK_DATA, SEND_CHECKBOXES, SEND_GAMEBOARD, SEND_ID, RESPONSE } from "./messages";
import { sendPayload } from "./helper/wsSend";

export class Game {
  public gameId: string;
  public player1: WebSocket;
  public player2: WebSocket;
  private player1_GameBoard: Bingo;
  private player2_GameBoard: Bingo;
  private players: WebSocket[];
  private gameBoards: Bingo[];
  private moveCount: number

  constructor(id: string, player1: WebSocket, player2: WebSocket) {
    this.gameId = id;
    this.moveCount = 1;
    this.player1 = player1;
    this.player2 = player2;

    this.player1_GameBoard = new Bingo();
    this.player2_GameBoard = new Bingo();

    // putting things assigend values array
    this.players = [player1, player2];
    this.gameBoards = [this.player1_GameBoard, this.player2_GameBoard];


    this.players.forEach((player, index) => {
      // Send gameId
    sendPayload(player, SEND_ID, this.gameId)

      // Send game board to each player
      sendPayload(player, SEND_GAMEBOARD, this.gameBoards[index].getGameBoard() as Partial<GameBoard>)
    });
  }

addCheck(currentPlayer: WebSocket, value: BoxesValue) {
    
  if (Number(value) > 25) {
    sendPayload(currentPlayer, RESPONSE, "Value should be less than 25");
    return;
  }

  const isPlayer1 = currentPlayer === this.player1;
  const isPlayer2 = currentPlayer === this.player2;
  const isPlayer1Turn = this.moveCount % 2 === 1 && isPlayer1;
  const isPlayer2Turn = this.moveCount % 2 === 0 && isPlayer2;

  if (!(isPlayer1Turn || isPlayer2Turn)) {
    sendPayload(currentPlayer, RESPONSE, "Please wait for your turn");
    return;
  }

  try {
    // Apply the check mark to the appropriate player's board
    this.gameBoards.forEach((gameBoard) => gameBoard.addCheckMark(value));

    // Send the check mark data to the opponent
    const data: ADD_CHECK_MARK_DATA = {
      gameId: this.gameId,
      value,
    };
    const waitingPlayer = isPlayer1 ? this.player2 : this.player1;
    sendPayload(waitingPlayer, ADD_CHECK_MARK, data);

    
    
    this.players.forEach((player, index) => {

        const data = {
            checkedBoxes: this.gameBoards[index].getCheckBoxes(),
            checkedLines: this.gameBoards[index].getLineCheckBoxes()
        } 
        sendPayload(player, SEND_CHECKBOXES, data)
    });

    // Increment the move count
    this.moveCount++;
  } catch (error: any) {
    sendPayload(currentPlayer, RESPONSE, error.message);
  }
}
}
