import { boxes, possibleLines } from "./boxes_and_ways";
import { BoxesName, BoxesValue, GameBoard, randomValuesForGameBoard } from "./gameBoards";

export class Bingo {
    private lineCheckBoxes: BoxesName[][] = [];
    private checkedBoxes: BoxesName[]  = [];
    private gameBoard: GameBoard = new Array(25).fill({ boxName: 'a', boxValue: '1' }); // Correct type initialization
    private LineCount: number;

    constructor() {
        this.LineCount = 0;
        randomValuesForGameBoard(this.gameBoard); // Initialize the game board with random values
    }

    getGameBoard() {
        return this.gameBoard;
    }

    getCheckBoxes() {
        return this.checkedBoxes;
    }

    getLineCheckBoxes() {
        return this.lineCheckBoxes;
    }

    add_value_to_Box(boxName: BoxesName, boxValue: BoxesValue): void {
        // Ensure the box name and value are valid
        if (boxes.includes(boxName) && Number(boxValue) >= 1 && Number(boxValue) <= 25) {
            // Find the index in gameBoard and update the value
            const boxIndex = boxes.indexOf(boxName);
            if (boxIndex >= 0 && this.gameBoard[boxIndex]) {
                // Update the game board with the new value for the specific box
                this.gameBoard[boxIndex] = {
                    boxName,
                    boxValue
                };
            }
        } else {
            throw new Error("Invalid box name or value");
        }
        console.log('Updated game board:', this.gameBoard);
    }

    isVictory(): boolean {
        return this.LineCount >= 5; // Assuming a win is when 5 lines are completed
    }

    private validations(): void {
        let validCount = 0; // Counter to track valid subarrays

        // Iterate through each subarray in possibleLines
        for (let i = 0; i < possibleLines.length; i++) {
            let isMatch = true;

            // Check if all elements of the current subarray are included in checkedBoxes
            for (let j = 0; j < possibleLines[i].length; j++) {
                if (!this.checkedBoxes.includes(possibleLines[i][j])) {
                    isMatch = false;
                    break;
                }
            }

            // If the subarray is fully matched, increment the counter
            if (isMatch) {
                this.lineCheckBoxes.push(possibleLines[i]);
                validCount++;
            }
        }

        this.LineCount = validCount;

        if (this.isVictory()) throw new Error("Game has been won");
    }

    addCheckMark(boxValue: BoxesValue): void {
        // Iterate over the gameBoard and match the boxValue
        for (let i = 0; i < this.gameBoard.length; i++) {
            // Check if the gameBoard entry is valid and contains the correct value
            if (this.gameBoard[i] && this.gameBoard[i].boxValue === boxValue) {
                const boxName = this.gameBoard[i].boxName; // Get box name

                // Check if already marked
                if (this.checkedBoxes.includes(boxName)) {
                    throw new Error(`${boxName} is already marked`);
                }

                // Add the boxName to checkedBoxes
                this.checkedBoxes.push(boxName);
            }
        }

        this.validations();
    }
}