import { WebSocket } from "ws";
import {
  Box,
  BoxesValue,
  GET_RESPONSE,
  GET_GAME,
  PAYLOAD_GET_GAME,
  GET_CHECKBOXES,
  PAYLOAD_PUT_GET_CHECK_MARK,
  GET_CHECK_MARK,
  PAYLOAD_GET_CHECKBOXES,
  GET_LOST,
  GET_VICTORY,
  WinMethodTypes,
  PlayerData,
  PlayerGameboardData,
  TossDecision,
} from "@repo/games/client/bingo/messages";
import { Bingo } from "@repo/games/bingo";
import { sendPayload } from "../helper/wsSend";
import { client } from "@repo/db/client";
import { redis_addMove, redis_newGame, redis_tossGameUpdate } from "@repo/redis-worker/test";



export class Game {
  public gameId: string;
  private moveCount: number;
  public p1_socket: WebSocket;
  public p2_socket: WebSocket;
  private playerData: PlayerData[];
  private playerSockets: WebSocket[];
  private playerBoards: Bingo[];
  private playerGameboardData: PlayerGameboardData[];
  private tossWinner : string // put playerId here

  constructor(
    gameId: string,
    p1_socket: WebSocket,
    p2_socket: WebSocket,
    p1_data: PlayerData,
    p2_data: PlayerData
  ) {
    this.gameId = gameId;
    this.moveCount = 1;
    this.p1_socket = p1_socket;
    this.p2_socket = p2_socket;
    this.playerSockets = [p1_socket, p2_socket];
    this.playerBoards = [new Bingo(), new Bingo()];
    this.playerData = [p1_data, p2_data]
    this.playerGameboardData = [
      {
        playerId: this.playerData[0].user.bingoProfile.id,
        gameBoard: this.playerBoards[0].getGameBoard(),
      },
      {
        playerId: this.playerData[1].user.bingoProfile.id,
        gameBoard: this.playerBoards[1].getGameBoard(),
      },
    ];
    console.log('CHKECER!!!!!', this.playerGameboardData)
    console.log("First player data", this.playerData[0]);
    console.log("Second player data", this.playerData[1]);
    
    // Decision of toss winner
    if(Math.random() <0.50) {
      this.tossWinner = this.playerData[0].user.bingoProfile.id
    } else {
      this.tossWinner = this.playerData[1].user.bingoProfile.id
    }

    // Send game info
    this.playerSockets.forEach((socket, index) => {
      const gameData: PAYLOAD_GET_GAME = {
        type: GET_GAME,
        payload: {
          gameId: this.gameId,
          tossWinner: this.tossWinner,
          players: this.playerData ,
          gameBoard: this.playerBoards[index].getGameBoard(),
        },
      };
      sendPayload(socket, GET_GAME, gameData);
    });
    
    // redisHandle
redis_newGame(this.gameId, this.tossWinner, this.playerData,  this.playerGameboardData )

  }

  private endGame(method: WinMethodTypes, winner: string) {}

  addCheck(currentPlayerSocket: WebSocket, value: BoxesValue) {
    if (Number(value) > 25) {
      sendPayload(currentPlayerSocket, GET_RESPONSE, "Value should be less than 25");
      return;
    }

    const isFirstPlayer = currentPlayerSocket === this.p1_socket;
    const isSecondPlayer = currentPlayerSocket === this.p2_socket;
    const isFirstPlayerTurn = this.moveCount % 2 === 1 && isFirstPlayer;
    const isSecondPlayerTurn = this.moveCount % 2 === 0 && isSecondPlayer;

    if (!(isFirstPlayerTurn || isSecondPlayerTurn)) {
      sendPayload(currentPlayerSocket, GET_RESPONSE, "Please wait for your turn");
      return;
    }

    try {
      // Apply the check mark to the appropriate player's board
      this.playerBoards.forEach((board) => board.addCheckMark(value));

      // Send the check mark data to the opponent
      const checkMarkData: PAYLOAD_PUT_GET_CHECK_MARK = {
        type: GET_CHECK_MARK,
        payload: {
          gameId: this.gameId,
          value,
        },
      };

      const waitingPlayerSocket = isFirstPlayer ? this.p2_socket : this.p1_socket;
      sendPayload(waitingPlayerSocket, GET_CHECK_MARK, checkMarkData);
      redis_addMove(this.gameId, this.moveCount, value, Date.now())

      // sending all checkBoxes data
      this.playerSockets.forEach((socket, index) => {
        const checkBoxesData: PAYLOAD_GET_CHECKBOXES = {
          type: GET_CHECKBOXES,
          payload: {
            checkedBoxes: this.playerBoards[index].getCheckBoxes(),
            checkedLines: this.playerBoards[index].getLineCheckBoxes(),
          },
        };
        sendPayload(socket, GET_CHECKBOXES, checkBoxesData);
      });

      // Increment the move count
      this.moveCount++;
    } catch (error: any) {
      console.error("ERROR", error.mesages);
      sendPayload(currentPlayerSocket, GET_RESPONSE, error.message);
    }
  }

tossDecision(currentPlayerSocket: WebSocket, decision: TossDecision) {
  const isFirstPlayer = currentPlayerSocket === this.p1_socket;
  const isSecondPlayer = currentPlayerSocket === this.p2_socket;

  if (isFirstPlayer && decision === TossDecision.TOSS_GO_SECOND) {
    // Swap the sockets if the first player chooses "TOSS_GO_SECOND"
    [this.p1_socket, this.p2_socket] = [this.p2_socket, this.p1_socket];
    [this.playerData[0], this.playerData[1]] = [this.playerData[1], this.playerData[0]]
  } else if (isSecondPlayer && decision === TossDecision.TOSS_GO_FIRST) {
    // Swap the sockets if the second player chooses "TOSS_GO_FIRST"
    [this.p1_socket, this.p2_socket] = [this.p2_socket, this.p1_socket];
    [this.playerData[0], this.playerData[1]] = [this.playerData[1], this.playerData[0]]
  } else return;

  // update the bingoGame with respect to toss Decision
  redis_tossGameUpdate(this.gameId, this.playerData)
}

  resign(currentPlayerSocket: WebSocket) {
    const isFirstPlayer = currentPlayerSocket === this.p1_socket;
    const isSecondPlayer = currentPlayerSocket === this.p2_socket;

    if (isFirstPlayer) {
      // Notify first player that they lost
      sendPayload(this.p1_socket, GET_LOST, {
        message: "You resigned and lost the game.",
      });
      // Notify second player that they won
      sendPayload(this.p2_socket, GET_VICTORY, {
        message: "Your opponent resigned. You won!",
      });
    } else if (isSecondPlayer) {
      // Notify second player that they lost
      sendPayload(this.p2_socket, GET_LOST, {
        message: "You resigned and lost the game.",
      });
      // Notify first player that they won
      sendPayload(this.p1_socket, GET_VICTORY, {
        message: "Your opponent resigned. You won!",
      });
    }

    // Cleanup logic
    if (isFirstPlayer || isSecondPlayer) {
      // this.endGame();
    }
  }
}