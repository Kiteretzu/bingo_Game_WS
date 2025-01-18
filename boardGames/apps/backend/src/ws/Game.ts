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
  MessageType,
  PAYLOAD_GET_RECIEVE_EMOTE,
  PAYLOAD_GET_UPDATED_GAME,
  GET_UPDATED_GAME,
  MatchHistory,
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
  private gotFirstBlood: boolean = false;
  private matchHistory: MatchHistory = [];

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
      firstPlayerId: this.playerData[0].user.bingoProfile.id,
      secondPlayerId: this.playerData[1].user.bingoProfile.id,
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
        const VictoryPayload: PAYLOAD_GET_VICTORY["payload"] = {
          method: GameEndMethod.BINGO,
          message: "Bingo! You won!",
          goals: null,
        };
        const LostPayload: PAYLOAD_GET_LOST["payload"] = {
          method: GameEndMethod.BINGO,
          message: "You lost! Your opponent won the game.",
        };
        if (currentPlayerBoard.isVictory()) {
          sendPayload(currentSocket, GET_VICTORY, {
            ...VictoryPayload,
            goals: currentPlayerBoard.getGoals(),
          });
          sendPayload(opponentSocket, GET_LOST, LostPayload);
          opponentPlayerBoard.setGameOver(true);
          console.log("Current player won");
        } else if (opponentPlayerBoard.isVictory()) {
          sendPayload(opponentSocket, GET_VICTORY, {...VictoryPayload, goals: opponentPlayerBoard.getGoals()});
          sendPayload(currentSocket, GET_LOST, LostPayload);
          currentPlayerBoard.setGameOver(true);
          console.log("Opponent player won");
        }
        break;
      }
      case GameEndMethod.RESIGNATION: {
        const VictoryPayload: PAYLOAD_GET_VICTORY["payload"] = {
          method: GameEndMethod.RESIGNATION,
          message: "Your opponent resigned. You won!",
          goals: opponentPlayerBoard.getGoals(), // as currentSocket resigned
        };
        const LostPayload: PAYLOAD_GET_LOST["payload"] = {
          method: GameEndMethod.RESIGNATION,
          message: "You resigned and lost the game.",
        };

        // Simplified logic
        sendPayload(currentSocket, GET_LOST, LostPayload);
        sendPayload(opponentSocket, GET_VICTORY, VictoryPayload);
        console.log("Game ended due to resignation.");
        break;
      }
      // TODO abondon logic and when it get invoked
      case GameEndMethod.ABANDON: {
        break;
      }
    }
  }

  private updatePlayerBoards(value: BoxesValue) {
    this.playerBoards.forEach((board) => board.addCheckMark(value));
  }

  private notifyOpponent(opponentSocket: WebSocket, value: BoxesValue) {
    const checkMarkData: PAYLOAD_PUT_GET_CHECK_MARK = {
      type: GET_CHECK_MARK,
      payload: {
        gameId: this.gameId,
        value,
      },
    };
    sendPayload(opponentSocket, GET_CHECK_MARK, checkMarkData);
  }

  private saveMove(currentPlayerSocket:WebSocket, value: BoxesValue) {
    const {isFirstPlayerTurn, firstPlayerId, secondPlayerId} =  this.getPlayerContext(currentPlayerSocket);

    this.matchHistory.push({
      move: this.moveCount,
      value,
      by: isFirstPlayerTurn ? firstPlayerId : secondPlayerId,
      timestamp: Date.now(),
    });
    redis_addMove(this.gameId, this.moveCount, value, isFirstPlayerTurn? firstPlayerId: secondPlayerId , Date.now(),);
  }

  private broadcastUpdatedGame() {
    this.playerSockets.forEach((socket, index) => {
      
      const updatedGameData: PAYLOAD_GET_UPDATED_GAME = {
        type: GET_UPDATED_GAME,
        payload: {
          goals: this.playerBoards[index].getGoals(),
          checks: {
            checkedBoxes: this.playerBoards[index].getCheckBoxes(),
            checkedLines: this.playerBoards[index].getLineCheckBoxes(),
          },
          matchHistory: this.matchHistory,
        },
      };

      console.log('this is index', index, this.playerBoards[index].getGoals());

      sendPayload(socket, GET_UPDATED_GAME , updatedGameData);
    });
  }

  private checkFirstBloodStatus(
    currentPlayerBoard: Bingo,
    opponentPlayerBoard: Bingo
  ) {
    console.log('in here checking bloodStatus',)
    if (
      currentPlayerBoard.LineCount <= 1 &&
      opponentPlayerBoard.LineCount === 0
    ) {
      console.log('Player one got firstBlood',)
      currentPlayerBoard.setFirstBlood(true);
      console.log('this is player one goals', currentPlayerBoard.getGoals())
      opponentPlayerBoard.setFirstBlood(false);
          this.gotFirstBlood = true;
    } else if (
    
      currentPlayerBoard.LineCount === 0 &&
      opponentPlayerBoard.LineCount <= 1
    ) {
        console.log('Player two got firstBlood');
      currentPlayerBoard.setFirstBlood(false);
      opponentPlayerBoard.setFirstBlood(true);
          this.gotFirstBlood = true;
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
      // Add the value to the player's board
      this.updatePlayerBoards(value);

      // Notify the opponent about the move
      this.notifyOpponent(opponentPlayerSocket, value);

      // Save the move in the database and moveHistory
      this.saveMove(currentPlayerSocket, value);
      
      //check for first blood
      if(!this.gotFirstBlood) {
      this.checkFirstBloodStatus(currentPlayerBoard, opponentPlayerBoard);
      }
      // get the updated ChecksBoxes to all players
      this.broadcastUpdatedGame();
      
      // Increment the move count
      this.moveCount++;
      
      // check if game is won by "Bingo" win method
      if (currentPlayerBoard.isGameOver() || opponentPlayerBoard.isGameOver()) {
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

  sendEmote(currentPlayerSocket: WebSocket, emote: string) {
    const { opponentPlayerSocket } = this.getPlayerContext(currentPlayerSocket);

    const data: PAYLOAD_GET_RECIEVE_EMOTE["payload"] = {
      emote,
    };

    sendPayload(opponentPlayerSocket, MessageType.GET_RECIEVE_EMOTE, data);
  }
}
