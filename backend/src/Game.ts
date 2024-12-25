import { WebSocket } from "ws";
import { BoxesValue, GameBoard } from "./util/gameBoards";
import { Bingo } from "./util";
import { ADD_CHECK_MARK } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private player1_GameBoard: Bingo;
    private player2_GameBoard: Bingo;

    constructor(id: string, player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1_GameBoard = new Bingo();  // Corrected instantiation
        this.player2_GameBoard = new Bingo();  // Corrected instantiation

        // Send game ID to both players
        this.player1.send(JSON.stringify({ gameId: id }));
        this.player2.send(JSON.stringify({ gameId: id }));

        // Send game boards to both players
        this.player1.send(JSON.stringify(this.player1_GameBoard.getGameBoard() as Partial<GameBoard>));
        this.player2.send(JSON.stringify(this.player2_GameBoard.getGameBoard() as Partial<GameBoard>));
    }


addCheck(socket: WebSocket, value: BoxesValue) {
    const isPlayer1 = socket === this.player1;
    const currentGameBoard = isPlayer1 ? this.player1_GameBoard : this.player2_GameBoard;
    const waitingPlayer = isPlayer1 ? this.player2 : this.player1;

    waitingPlayer.send("Please wait for your turn");
    currentGameBoard.addCheckMark(value);

    waitingPlayer.send(JSON.stringify({
        type: ADD_CHECK_MARK,
        data: value
    }));
}
}