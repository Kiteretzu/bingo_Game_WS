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
  PlayerData,
  PlayerGameboardData,
  TossDecision,
  BINGO,
  GameEndMethod,
  PAYLOAD_GET_VICTORY,
  PAYLOAD_GET_LOST,
} from "@repo/games/client/bingo/messages";
import { Bingo } from "@repo/games/bingo";
import { sendPayload } from "../helper/wsSend";
import { client } from "@repo/db/client";
import {
  redis_addMove,
  redis_newGame,
  redis_tossGameUpdate,
} from "@repo/redis-worker/test";

export class Game {
  public gameId: string;
  private moveCount: number;
  public p1_socket: WebSocket;
  public p2_socket: WebSocket;
  private playerData: PlayerData[];
  private playerSockets: WebSocket[];
  private playerBoards: Bingo[];
  private playerGameboardData: PlayerGameboardData[];
  private tossWinner: string;

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
    this.playerData = [p1_data, p2_data];
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

    this.tossWinner =
      Math.random() < 0.5
        ? this.playerData[0].user.bingoProfile.id
        : this.playerData[1].user.bingoProfile.id;

    this.playerSockets.forEach((socket, index) => {
      const gameData: PAYLOAD_GET_GAME = {
        type: GET_GAME,
        payload: {
          gameId: this.gameId,
          tossWinner: this.tossWinner,
          players: this.playerData,
          gameBoard: this.playerBoards[index].getGameBoard(),
        },
      };
      sendPayload(socket, GET_GAME, gameData);
    });

    redis_newGame(
      this.gameId,
      this.tossWinner,
      this.playerData,
      this.playerGameboardData
    );
  }

  private getPlayerContext(currentPlayerSocket: WebSocket) {
    const isFirstPlayer = currentPlayerSocket === this.p1_socket;

    return {
      isFirstPlayer,
      isSecondPlayer: !isFirstPlayer,
      isFirstPlayerTurn: this.moveCount % 2 === 1 && isFirstPlayer,
      isSecondPlayerTurn: this.moveCount % 2 === 0 && !isFirstPlayer,
      currentPlayerBoard: isFirstPlayer
        ? this.playerBoards[0]
        : this.playerBoards[1],
      opponentPlayerBoard: isFirstPlayer
        ? this.playerBoards[1]
        : this.playerBoards[0],
      currentPlayerSocket,
      opponentPlayerSocket: isFirstPlayer ? this.p2_socket : this.p1_socket,
    };
  }

  private endGame(
    currentPlayerSocket: WebSocket,
    gameEndMethod: GameEndMethod
  ) {
    const {
      currentPlayerBoard,
      opponentPlayerBoard,
      currentPlayerSocket: currentSocket,
      opponentPlayerSocket: opponentSocket,
    } = this.getPlayerContext(currentPlayerSocket);
    switch (gameEndMethod) {
      case GameEndMethod.BINGO: {
        const VictoryPayload: PAYLOAD_GET_VICTORY['payload'] = {
          method: GameEndMethod.BINGO,
          message: "Bingo!",
          data: {}
        };
        const LostPayload: PAYLOAD_GET_LOST['payload'] = {
          method: GameEndMethod.BINGO,
          message: "You lost!",
        };
        if (currentPlayerBoard.isVictory()) {
          sendPayload(currentSocket, GET_VICTORY, {...VictoryPayload, data: currentPlayerBoard.getGoals()});
          sendPayload(opponentSocket, GET_LOST, LostPayload);
          opponentPlayerBoard.setGameOver(true);
          console.log("Current player won");
        } else if (opponentPlayerBoard.isVictory()) {
          sendPayload(opponentSocket, GET_VICTORY, VictoryPayload);
          sendPayload(currentSocket, GET_LOST, LostPayload);
          currentPlayerBoard.setGameOver(true);
          console.log("Opponent player won");
        }
        break;
      }
      case GameEndMethod.RESIGNATION: {
      const VictoryPayload: PAYLOAD_GET_VICTORY['payload'] = {
        method: GameEndMethod.RESIGNATION,
        message: "Your opponent resigned. You won!",
        data: {}
      };
      const LostPayload: PAYLOAD_GET_LOST['payload'] = {
        method: GameEndMethod.RESIGNATION,
        message: "You resigned and lost the game.",
      };

      // Simplified logic
      sendPayload(currentSocket, GET_LOST, LostPayload);
      sendPayload(opponentSocket, GET_VICTORY, {...VictoryPayload, data: opponentPlayerBoard.getGoals()});
      console.log("Game ended due to resignation.");
      break;
      }
      // abondon logic and when it get invoked
      case GameEndMethod.ABANDON: {

        break;
      }
    }
  }

  addCheck(currentPlayerSocket: WebSocket, value: BoxesValue) {
    if (Number(value) > 25) {
      sendPayload(
        currentPlayerSocket,
        GET_RESPONSE,
        "Value should be less than 25"
      );
      return;
    }

    const {
      isFirstPlayerTurn,
      isSecondPlayerTurn,
      currentPlayerBoard,
      opponentPlayerBoard,
      opponentPlayerSocket,
    } = this.getPlayerContext(currentPlayerSocket);

    if (!(isFirstPlayerTurn || isSecondPlayerTurn)) {
      sendPayload(
        currentPlayerSocket,
        GET_RESPONSE,
        "Please wait for your turn"
      );
      return;
    }

    try {
      this.playerBoards.forEach((board) => board.addCheckMark(value));

      const checkMarkData: PAYLOAD_PUT_GET_CHECK_MARK = {
        type: GET_CHECK_MARK,
        payload: {
          gameId: this.gameId,
          value,
        },
      };
      // send the given value to opponent player
      sendPayload(opponentPlayerSocket, GET_CHECK_MARK, checkMarkData);
      // save the move in db
      redis_addMove(this.gameId, this.moveCount, value, Date.now());

      // get the updated ChecksBoxes to all players
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

      this.moveCount++;

      // check if game is won by "Bingo" win method
      if (currentPlayerBoard.isGameOver() || opponentPlayerBoard.isGameOver()) {
        console.log('in hereGameOVer', currentPlayerBoard.LineCount, opponentPlayerBoard.LineCount)
        this.endGame(currentPlayerSocket, GameEndMethod.BINGO);
      }
    } catch (error: any) {
      console.error("ERROR", error);
      sendPayload(currentPlayerSocket, GET_RESPONSE, error.message);
    }
  }

  tossDecision(currentPlayerSocket: WebSocket, decision: TossDecision) {
    const { isFirstPlayer, isSecondPlayer } =
      this.getPlayerContext(currentPlayerSocket);

    if (isFirstPlayer && decision === TossDecision.TOSS_GO_SECOND) {
      [this.p1_socket, this.p2_socket] = [this.p2_socket, this.p1_socket];
      [this.playerData[0], this.playerData[1]] = [
        this.playerData[1],
        this.playerData[0],
      ];
    } else if (isSecondPlayer && decision === TossDecision.TOSS_GO_FIRST) {
      [this.p1_socket, this.p2_socket] = [this.p2_socket, this.p1_socket];
      [this.playerData[0], this.playerData[1]] = [
        this.playerData[1],
        this.playerData[0],
      ];
    } else return;

    redis_tossGameUpdate(this.gameId, this.playerData);
  }

  resign(currentPlayerSocket: WebSocket) {
    this.endGame(currentPlayerSocket, GameEndMethod.RESIGNATION);
  }
}
