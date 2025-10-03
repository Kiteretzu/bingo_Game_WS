import { Bingo } from "@repo/games/bingo";
import {
  BoxesValue,
  EndGame,
  GET_CHECK_MARK,
  GET_GAME,
  GET_LOST,
  GET_RECONNECT,
  GET_RESPONSE,
  GET_UPDATED_GAME,
  GET_VICTORY,
  GameEndMethod,
  GoalType,
  MatchHistory,
  MessageType,
  PAYLOAD_GET_GAME,
  PAYLOAD_GET_LOST,
  PAYLOAD_GET_RECIEVE_EMOTE,
  PAYLOAD_GET_RECONNECT,
  PAYLOAD_GET_UPDATED_GAME,
  PAYLOAD_GET_VICTORY,
  PAYLOAD_PUT_GET_CHECK_MARK,
  PlayerData,
  PlayerGameboardData,
  TossDecision,
} from "@repo/messages/message";
import {
  redis_addMove,
  redis_newGame,
  redis_saveEndGame,
  redis_tossGameUpdate,
} from "@repo/redis/producers";
import { WebSocket } from "ws";
import { gameManager } from "./GameManager";
import { sendPayload } from "./helpers/wsSend";

// assuming all the sockets are alive

export class Game {
  public gameId: string;
  public p1_socket: WebSocket | null;
  public p2_socket: WebSocket | null;
  public playerData: PlayerData[];
  public moveCount: number;
  public playerSockets: (WebSocket | null)[];
  public playerBoards: Bingo[];
  public playerGameboardData: PlayerGameboardData[];
  public tossWinnerId: string;
  public gotFirstBlood: boolean = false;
  public matchHistory: MatchHistory = [];
  public gameStarted: boolean = false;

  constructor(
    gameId: string,
    p1_socket: WebSocket | null,
    p2_socket: WebSocket | null,
    p1_data: PlayerData,
    p2_data: PlayerData,
    playerBoards?: PlayerGameboardData[],
    matchHistory?: MatchHistory,
    tossWinnerId?: string | null,
    gameStarted?: boolean
  ) {
    this.gameId = gameId; // need

    if (arguments.length === 9) {
      this.gameStarted = gameStarted ?? false; // need to send
      this.p1_socket = p1_socket!;
      this.p2_socket = p2_socket!;
      this.playerSockets = [p1_socket!, p2_socket!];
      this.moveCount = 1;
      this.playerData = [p1_data, p2_data];
      this.playerBoards = [
        new Bingo(playerBoards![0].gameBoard), // need to send
        new Bingo(playerBoards![1].gameBoard),
      ];
      this.playerGameboardData = [
        {
          gameBoard: playerBoards![0].gameBoard,
        },
        {
          gameBoard: playerBoards![1].gameBoard,
        },
      ];

      this.tossWinnerId = tossWinnerId ?? ""; // need to send
      this.simulateGame(matchHistory!);
    } else {
      this.moveCount = 1; // need which is not getting
      this.p1_socket = p1_socket; // need which is not getting
      this.p2_socket = p2_socket; // need which is not getting
      this.playerSockets = [p1_socket, p2_socket];
      this.playerBoards = [new Bingo(), new Bingo()]; // need to send
      this.playerData = [p1_data, p2_data];
      this.playerGameboardData = [
        {
          gameBoard: this.playerBoards[0].getGameBoard(),
        },
        {
          gameBoard: this.playerBoards[1].getGameBoard(),
        },
      ];

      this.tossWinnerId =
        Math.random() < 0.5
          ? this.playerData[0].user.bingoProfile.id
          : this.playerData[1].user.bingoProfile.id;

      this.playerSockets.forEach((socket, index) => {
        const gameData: PAYLOAD_GET_GAME = {
          type: GET_GAME,
          payload: {
            gameId: this.gameId,
            tossWinnerId: this.tossWinnerId,
            players: this.playerData,
            gameBoard: this.playerBoards[index].getGameBoard(),
            isGameStarted: this.gameStarted,
          },
        };
        sendPayload(socket!, GET_GAME, gameData);
      });

      redis_newGame(
        this.gameId,
        this.tossWinnerId,
        this.playerData,
        this.playerGameboardData
      );
    }

    // this.pingPong();
  }

  simulateGame(matchHistory: MatchHistory) {
    this.matchHistory = matchHistory;
    matchHistory.forEach((move) => {
      this.updatePlayerBoards(move.value);
      this.moveCount++;
    });
  }

  // maybe we dont need this
  // saveInRedis() {
  //   gameServices.test(this);
  // }

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
      opponentPlayerSocket: isFirstPlayer ? this.p2_socket! : this.p1_socket!, // the have to be present
    };
  }

  private getPlayerContextByUserId(userId: string) {
    const isFirstPlayer = this.playerData[0].user.googleId === userId;
    return {
      gameBoard: isFirstPlayer
        ? this.playerBoards[0].getGameBoard()
        : this.playerBoards[1].getGameBoard(),
      oldSocket: isFirstPlayer ? this.p1_socket : this.p2_socket,
    };
  }

  private mmrAllocation(
    winnerSocket: WebSocket,
    gameEndMethod?: GameEndMethod
  ): {
    winnerMMR: any;
    loserMMR: any;
  } {
    const { currentPlayerBoard, opponentPlayerBoard } =
      this.getPlayerContext(winnerSocket);
    let totalWinningPoints = 0;
    let totalLosingPoints = 0;
    let baseWinningPoints: number = Math.floor(Math.random() * 5) + 20;
    let baseLosingPoints: number = Math.floor(Math.random() * 5) + 35;

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
          if (goal.isCompleted)
            firstBloodPoints += Math.floor(Math.random() * 5) + 2;
          break;
        }
        case GoalType.DOUBLE_KILL: {
          // on random give 6-12 points
          if (goal.isCompleted)
            doubleKillPoints += Math.floor(Math.random() * 6) + 6;
          break;
        }
        case GoalType.TRIPLE_KILL: {
          // on random give 12-18 points
          if (goal.isCompleted)
            tripleKillPoints += Math.floor(Math.random() * 6) + 12;
          break;
        }
        case GoalType.PERFECTIONIST: {
          // on random give 25-35 points
          if (goal.isCompleted)
            perfectionistPoints += Math.floor(Math.random() * 10) + 25;
          break;
        }
        case GoalType.RAMPAGE: {
          // on random give 18-25 points
          if (goal.isCompleted)
            rampagePoints += Math.floor(Math.random() * 7) + 18;
          break;
        }
      }
    });

    if (gameEndMethod == GameEndMethod.RESIGNATION) {
      const linesLeft = 5 - opponentPlayerBoard.LineCount;
      // early resignation will be punished with default value of lossingBasePoints
      if (linesLeft === 1) {
        console.log("before Lossing points", baseLosingPoints);
        baseLosingPoints -= Math.floor(Math.random() * (6 - 4 + 1)) + 4; // Deduct between 4 and 6
        console.log("after Lossing points", baseLosingPoints);
      } else if (linesLeft === 2) {
        baseLosingPoints -= Math.floor(Math.random() * (12 - 10 + 1)) + 10; // Deduct between 10 and 12
      } else if (linesLeft === 3) {
        baseLosingPoints -= Math.floor(Math.random() * (15 - 12 + 1)) + 12; // Deduct between 12 and 15
      } else if (linesLeft === 4) {
        baseLosingPoints -= Math.floor(Math.random() * (18 - 17 + 1)) + 17; // Deduct between 17 and 18
      } else if (linesLeft === 5) {
        baseLosingPoints -= 20; // Deduct 20
      }
    }

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

  private bingoEndGame(socket: WebSocket): EndGame | null {
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
        gameEndMethod: GameEndMethod.BINGO,
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
        gameEndMethod: GameEndMethod.BINGO,
      };
    }

    return null;
  }

  private resignationEndGame(socket: WebSocket): EndGame {
    const {
      currentPlayerBoard,
      opponentPlayerBoard,
      currentPlayerSocket,
      opponentPlayerSocket,
      currentPlayer,
      opponentPlayer,
    } = this.getPlayerContext(socket);

    const { loserMMR, winnerMMR } = this.mmrAllocation(
      opponentPlayerSocket,
      GameEndMethod.RESIGNATION
    );

    const VictoryPayload: PAYLOAD_GET_VICTORY["payload"] = {
      method: GameEndMethod.RESIGNATION,
      message: "Your opponent resigned. You won!",
      data: winnerMMR, // as currentSocket resigned
    };
    const LostPayload: PAYLOAD_GET_LOST["payload"] = {
      method: GameEndMethod.RESIGNATION,
      message: "You resigned and lost the game.",
      data: loserMMR,
    };

    // Simplified logic
    sendPayload(currentPlayerSocket, GET_LOST, LostPayload);
    sendPayload(opponentPlayerSocket, GET_VICTORY, VictoryPayload);
    console.log("Game ended due to resignation.");

    return {
      winner: {
        id: opponentPlayer.user.bingoProfile.id,
        lineCount: opponentPlayerBoard.LineCount,
        winnerMMR: winnerMMR,
        winnerGoal: opponentPlayerBoard.getGoals(),
      },
      loser: {
        id: currentPlayer.user.bingoProfile.id,
        lineCount: currentPlayerBoard.LineCount,
        loserMMR: loserMMR,
        loserGoal: currentPlayerBoard.getGoals(),
      },
      gameEndMethod: GameEndMethod.RESIGNATION,
    };
  }

  private endGame(
    currentPlayerSocket: WebSocket,
    gameEndMethod: GameEndMethod
  ) {
    switch (gameEndMethod) {
      case GameEndMethod.BINGO: {
        const { winner, loser, gameEndMethod } =
          this.bingoEndGame(currentPlayerSocket)!;
        // save this to end result
        redis_saveEndGame({
          gameId: this.gameId,
          winner,
          loser,
          gameEndMethod,
        }); // sent as obj
        break;
      }
      case GameEndMethod.RESIGNATION: {
        const { winner, loser, gameEndMethod } =
          this.resignationEndGame(currentPlayerSocket);
        // save this to end result
        redis_saveEndGame({
          gameId: this.gameId,
          winner,
          loser,
          gameEndMethod,
        });
        break;
      }
      // TODO abondon logic and when it get invoked
      case GameEndMethod.ABANDON: {
        break;
      }
    }
    gameManager.removeGame(this.gameId);
    gameManager.removeUserToGame(this.gameId);
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

    const moveData: MatchHistory[0] = {
      move: this.moveCount,
      value,
      by: isFirstPlayerTurn ? firstPlayerId : secondPlayerId,
      timestamp: Date.now(),
    };

    this.matchHistory.push(moveData);
    redis_addMove(this.gameId, moveData);
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
          isGameStarted: this.gameStarted,
        },
      };

      // console.log("this is index", index, this.playerBoards[index].getGoals());

      sendPayload(socket!, GET_UPDATED_GAME, updatedGameData);
    });

    // savng to redis
    // this.saveInRedis();
  }

  private checkFirstBloodStatus(
    currentPlayerBoard: Bingo,
    opponentPlayerBoard: Bingo
  ) {
    console.log("Evaluting first blood");
    if (
      currentPlayerBoard.LineCount >= 1 &&
      opponentPlayerBoard.LineCount === 0
    ) {
      currentPlayerBoard.setFirstBlood(true);
      opponentPlayerBoard.setFirstBlood(false);
      this.gotFirstBlood = true;
    } else if (
      currentPlayerBoard.LineCount === 0 &&
      opponentPlayerBoard.LineCount >= 1
    ) {
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

      console.log("hello!?");

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
    const { isFirstPlayer, isSecondPlayer, currentPlayer } =
      this.getPlayerContext(currentPlayerSocket);
    console.log("❤️ Before toss decision:", currentPlayer.user.displayName);
    console.log("also the ids", this.tossWinnerId, currentPlayer.user.googleId);
    console.log(
      "he is winner but",
      this.tossWinnerId == currentPlayer.user.bingoProfile.id
    );
    const shouldSwap =
      (isFirstPlayer && decision === TossDecision.TOSS_GO_SECOND) ||
      (isSecondPlayer && decision === TossDecision.TOSS_GO_FIRST);

    if (shouldSwap) {
      [this.p1_socket, this.p2_socket] = [this.p2_socket, this.p1_socket];
      [this.playerData[0], this.playerData[1]] = [
        this.playerData[1],
        this.playerData[0],
      ];
      [this.playerGameboardData[0], this.playerGameboardData[1]] = [
        this.playerGameboardData[1],
        this.playerGameboardData[0],
      ];
    }

    console.log("✅ After toss decision:", this.playerData[0]?.user.displayName);

    this.gameStarted = true;

    redis_tossGameUpdate({
      gameId: this.gameId,
      players: this.playerData,
      playerGameBoardData: this.playerGameboardData,
      gameStarted: this.gameStarted,
    });

    // send updatedGame to all players
    this.broadcastUpdatedGame();
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

  reconnectPlayer(newSocket: WebSocket, userId: string) {
    const { gameBoard, oldSocket } = this.getPlayerContextByUserId(userId);
    console.log("game-Reconnecting");
    const playerIndex = this.playerData.findIndex(
      (player) => player.user.googleId === userId
    );

    if (playerIndex === -1) {
      console.error("Player not found for reconnection");
      return;
    }

    // Replace the old socket with the new one
    if (playerIndex === 0) {
      this.p1_socket = newSocket;
    } else {
      this.p2_socket = newSocket;
    }

    this.playerSockets[playerIndex] = newSocket;

    // Notify the player about the reconnection
    const reconnectData: PAYLOAD_GET_RECONNECT = {
      type: GET_RECONNECT,
      payload: {
        gameId: this.gameId,
        gameBoard,
        players: this.playerData,
        tossWinnerId: this.tossWinnerId,
        isGameStarted: this.gameStarted,
      },
    };

    sendPayload(newSocket, GET_RECONNECT, reconnectData);
    this.broadcastUpdatedGame();

    // Optionally, you can close the old socket connection
    if (oldSocket) {
      oldSocket.close();
    }
  }

  pingPong() {
    setInterval(() => {
      this.playerSockets.forEach((socket) => {
        sendPayload(socket!, GET_RESPONSE, "Ping");
      });
    }, 10000);
  }
}
