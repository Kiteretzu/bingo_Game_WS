import { boxes, possibleLines } from "./boxes_and_ways";
import {  randomValuesForGameBoard } from "./gameBoards";
import { BoxesName, BoxesValue, GameBoard } from "./messages";

export class Bingo {
    private LineCount: number; // Tracks the number of lines completed
    public lineCheckBoxes: BoxesName[][]; // An array of arrays for storing matched lines
    private checkedBoxes: BoxesName[]; // An array to keep track of checked boxes
    private gameBoard: GameBoard; // Game board containing box names and values

    constructor() {
        this.LineCount = 0;
        this.lineCheckBoxes = []; // Initialize lineCheckBoxes here
        this.checkedBoxes = []; // Initialize checkedBoxes here
        this.gameBoard = new Array(25).fill({ boxName: 'a', boxValue: '1' }); // Initialize game board
        randomValuesForGameBoard(this.gameBoard); // Randomly fill the game board
        console.log('this is the BOARD!!', this.gameBoard)
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
            const boxIndex = boxes.indexOf(boxName);
            if (boxIndex >= 0 && this.gameBoard[boxIndex]) {
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
        return this.LineCount >= 5; // A win is when 5 lines are completed
    }

private validations(): void {
    let validCount = 0; // Counter to track valid subarrays

    // Clear `lineCheckBoxes` to avoid duplicates
    this.lineCheckBoxes = [];

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

        // If the subarray is fully matched, add it to lineCheckBoxes
        if (isMatch) {
            this.lineCheckBoxes.push(possibleLines[i]);
            validCount++;
        }
    }

    this.LineCount = validCount;

    // Check if the game is won
    if (this.isVictory()) throw new Error("Game has been won");
}

    addCheckMark(boxValue: BoxesValue): void {
        // Iterate over the gameBoard and match the boxValue
        for (let i = 0; i < this.gameBoard.length; i++) {
            const box = this.gameBoard[i];
            // Ensure that box is valid and contains the correct value
            if (box && box.boxValue === boxValue) {
                const boxName = box.boxName; // Get box name

                // Check if already marked
                if (this.checkedBoxes.includes(boxName)) {
                    throw new Error(`${boxName} is already marked`);
                }

                // Add the boxName to checkedBoxes
                this.checkedBoxes.push(boxName);
            }
        }

        // Validate the lines after the checkmark
        this.validations();
    }
}