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
  GoalType,
  EndGame,
} from "@repo/games/client/bingo/messages";
import { Bingo } from "@repo/games/bingo";
import { sendPayload } from "../helper/wsSend";
import { client } from "@repo/db/client";
import {
  redis_addMove,
  redis_newGame,
  redis_saveEndGame,
  redis_tossGameUpdate,
} from "@repo/redis-worker/test";
import { kStringMaxLength } from "buffer";

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
      currentPlayer: isFirstPlayer ? this.playerData[0] : this.playerData[1],
      opponentPlayer: isFirstPlayer ? this.playerData[1] : this.playerData[0],
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

  private mmrAllocation(winnerSocket: WebSocket): {
    winnerMMR: any;
    loserMMR: any;
  } {
    const { currentPlayerBoard, opponentPlayerBoard } =
      this.getPlayerContext(winnerSocket);
    let totalWinningPoints = 0;
    let totalLosingPoints = 0;
    const baseWinningPoints = Math.floor(Math.random() * 5) + 20;
    const baseLosingPoints = Math.floor(Math.random() * 5) + 35;

    // now calculate bonus points on basis of goals
    let bonusPoints = 0;
    let firstBloodPoints = 0;
    let doubleKillPoints = 0;
    let tripleKillPoints = 0;
    let perfectionistPoints = 0;
    let rampagePoints = 0;

    const goals = currentPlayerBoard.getGoals();
    goals.forEach((goal) => {
      switch (goal.goalName) {
        case GoalType.FIRST_BLOOD: {
          // on random give 2-6 points
          firstBloodPoints += Math.floor(Math.random() * 5) + 2;
          break;
        }
        case GoalType.DOUBLE_KILL: {
          // on random give 6-12 points
          doubleKillPoints += Math.floor(Math.random() * 6) + 6;
          break;
        }
        case GoalType.TRIPLE_KILL: {
          // on random give 12-18 points
          tripleKillPoints += Math.floor(Math.random() * 6) + 12;
          break;
        }
        case GoalType.PERFECTIONIST: {
          // on random give 25-35 points
          perfectionistPoints += Math.floor(Math.random() * 10) + 25;
          break;
        }
        case GoalType.RAMPAGE: {
          // on random give 18-25 points
          rampagePoints += Math.floor(Math.random() * 7) + 18;
          break;
        }
      }
    });
    totalWinningPoints +=
      baseWinningPoints +
      firstBloodPoints +
      doubleKillPoints +
      tripleKillPoints +
      perfectionistPoints +
      rampagePoints;
    totalLosingPoints += baseLosingPoints;
    return {
      winnerMMR: {
        totalWinningPoints,
        baseWinningPoints,
        firstBloodPoints,
        doubleKillPoints,
        tripleKillPoints,
        perfectionistPoints,
        rampagePoints,
      },
      loserMMR: {
        totalLosingPoints,
        baseLosingPoints,
      },
    };
  }

  private bingoEndGame(socket: WebSocket): EndGame  |null {
    const {
      currentPlayerBoard,
      opponentPlayerBoard,
      currentPlayerSocket,
      opponentPlayerSocket,
      currentPlayer,
      opponentPlayer,
    } = this.getPlayerContext(socket);
    const VictoryPayload: PAYLOAD_GET_VICTORY["payload"] = {
      method: GameEndMethod.BINGO,
      message: "Bingo! You won!",
      data: null,
    };
    const LostPayload: PAYLOAD_GET_LOST["payload"] = {
      method: GameEndMethod.BINGO,
      message: "You lost! Your opponent won the game.",
      data: null,
    };
    if (currentPlayerBoard.isVictory()) {
      const { winnerMMR, loserMMR } = this.mmrAllocation(currentPlayerSocket);
      console.log("Current player won");

      sendPayload(currentPlayerSocket, GET_VICTORY, {
        ...VictoryPayload,
        data: winnerMMR,
      });
      sendPayload(opponentPlayerSocket, GET_LOST, {
        ...LostPayload,
        data: loserMMR,
      });
      opponentPlayerBoard.setGameOver(true);

      return {
        winner: {
          id: currentPlayer.user.bingoProfile.id,
          winnerMMR,
          winnerGoal: currentPlayerBoard.getGoals(),
          
          lineCount: currentPlayerBoard.LineCount,
        },
        loser: {
          id: opponentPlayer.user.bingoProfile.id,
          loserMMR,
          loserGoal: opponentPlayerBoard.getGoals(),
          lineCount: opponentPlayerBoard.LineCount,
        },
        winMethod: GameEndMethod.BINGO,
      };
    } else if (opponentPlayerBoard.isVictory()) {
      const { winnerMMR, loserMMR } = this.mmrAllocation(opponentPlayerSocket);
      console.log("Opponent player won");

      sendPayload(opponentPlayerSocket, GET_VICTORY, {
        ...VictoryPayload,
        goals: winnerMMR,
      });
      sendPayload(currentPlayerSocket, GET_LOST, {
        ...LostPayload,
        data: loserMMR,
      });
      currentPlayerBoard.setGameOver(true);

      return {
        winner: {
          id: opponentPlayer.user.bingoProfile.id,
          winnerMMR,
          winnerGoal: {
            ...opponentPlayerBoard.getGoals(),
          },
          lineCount: opponentPlayerBoard.LineCount,
        },
        loser: {
          id: currentPlayer.user.bingoProfile.id,
          loserMMR,
          loserGoal: {
            ...currentPlayerBoard.getGoals(),
          },
          lineCount: currentPlayerBoard.LineCount,
        },
        winMethod: GameEndMethod.BINGO,
      };
    }

    return null
  }

  // private resignationEndGame(socket: WebSocket) {
  //   const {
  //     currentPlayerBoard,
  //     opponentPlayerBoard,
  //     currentPlayerSocket,
  //     opponentPlayerSocket,
  //   } = this.getPlayerContext(socket);

  //   // const { winner, loser } = this.mmrAllocation(opponentPlayerSocket);

  //   const VictoryPayload: PAYLOAD_GET_VICTORY["payload"] = {
  //     method: GameEndMethod.RESIGNATION,
  //     message: "Your opponent resigned. You won!",
  //     data: winner, // as currentSocket resigned
  //   };
  //   const LostPayload: PAYLOAD_GET_LOST["payload"] = {
  //     method: GameEndMethod.RESIGNATION,
  //     message: "You resigned and lost the game.",
  //     data: loser,
  //   };

  //   // Simplified logic
  //   sendPayload(currentPlayerSocket, GET_LOST, LostPayload);
  //   sendPayload(opponentPlayerSocket, GET_VICTORY, VictoryPayload);
  //   console.log("Game ended due to resignation.");
  // }

  private endGame(
    currentPlayerSocket: WebSocket,
    gameEndMethod: GameEndMethod
  ) {

    switch (gameEndMethod) {
      case GameEndMethod.BINGO: {
        const {winner, loser, winMethod} = this.bingoEndGame(currentPlayerSocket) !;
        // save this to end result
        redis_saveEndGame({gameId: this.gameId, winner, loser, winMethod}) // sent as obj
        break;
      }
      case GameEndMethod.RESIGNATION: {
        // this.resignationEndGame(currentPlayerSocket);
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

  private saveMove(currentPlayerSocket: WebSocket, value: BoxesValue) {
    const { isFirstPlayerTurn, firstPlayerId, secondPlayerId } =
      this.getPlayerContext(currentPlayerSocket);

    this.matchHistory.push({
      move: this.moveCount,
      value,
      by: isFirstPlayerTurn ? firstPlayerId : secondPlayerId,
      timestamp: Date.now(),
    });
    redis_addMove(
      this.gameId,
      this.moveCount,
      value,
      isFirstPlayerTurn ? firstPlayerId : secondPlayerId,
      Date.now()
    );
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

      console.log("this is index", index, this.playerBoards[index].getGoals());

      sendPayload(socket, GET_UPDATED_GAME, updatedGameData);
    });
  }

  private checkFirstBloodStatus(
    currentPlayerBoard: Bingo,
    opponentPlayerBoard: Bingo
  ) {
    console.log("in here checking bloodStatus");
    if (
      currentPlayerBoard.LineCount <= 1 &&
      opponentPlayerBoard.LineCount === 0
    ) {
      console.log("Player one got firstBlood");
      currentPlayerBoard.setFirstBlood(true);
      console.log("this is player one goals", currentPlayerBoard.getGoals());
      opponentPlayerBoard.setFirstBlood(false);
      this.gotFirstBlood = true;
    } else if (
      currentPlayerBoard.LineCount === 0 &&
      opponentPlayerBoard.LineCount <= 1
    ) {
      console.log("Player two got firstBlood");
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
      if (!this.gotFirstBlood) {
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
