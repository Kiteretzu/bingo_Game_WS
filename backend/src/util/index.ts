import { boxes, possibleLines } from "./boxes_and_ways";
import { BoxesName, BoxesValue, GameBoard, randomValuesForGameBoard } from "./gameBoards";

export class BingoGame {
    private Player_CheckedBoxes: BoxesName[] = [];
    private Player_GameBoard: Partial<GameBoard>; // Player_GameBoard is a partial representation of the full GameBoard
    private LineCount : number;
    constructor() {
        // Initialize the board using the provided function
        this.Player_GameBoard = {};
        this.LineCount = 0
        randomValuesForGameBoard(this.Player_GameBoard);
        console.log('before initialize', this.Player_GameBoard);
    }
    
    add_value_to_Box(boxName: BoxesName, boxValue: BoxesValue): void {
        // Ensure the box name and value are valid
        if (boxes.includes(boxName) && Number( boxValue )>= 1 && Number( boxValue) <= 25) {
            // Assert the boxName is a valid key of GameBoard
            this.Player_GameBoard[boxName as keyof GameBoard] = boxValue as GameBoard[keyof GameBoard];
        } else {
            throw new Error("Invalid box name or value");
        }
        console.log('this is changed board', this.Player_GameBoard);
    }

    private  validations(): void {
          let validCount = 0; // Counter to track valid subarrays
        
          // Iterate through each subarray in possibleLines
          for (let i = 0; i < possibleLines.length; i++) {
            let isMatch = true;
            
            // Check if all elements of the current subarray are included in testArray
            for (let j = 0; j < possibleLines[i].length; j++) {
              if (!this.Player_CheckedBoxes.includes(possibleLines[i][j])) {
                isMatch = false;
                break;
              }
            }
        
            // If the subarray is fully matched, increment the counter
            if (isMatch) {
              validCount++;
            }
          }
          
          this.LineCount = validCount
        }

    addCheckMark(boxValue: BoxesValue): void {
        // Iterate over the Player_GameBoard keys with the correct type assertion
        for (const key in this.Player_GameBoard) {
            // TypeScript assumes `key` is a string, but we want to ensure it's a key of GameBoard
            if (this.Player_GameBoard.hasOwnProperty(key) && this.Player_GameBoard[key as BoxesName ] as BoxesValue === boxValue) {
                // Push the key (box name) into Player_CheckedBoxes
                if(this.Player_CheckedBoxes.includes(key as BoxesName)) throw new Error(`${key} is already marked`)
                this.Player_CheckedBoxes.push(key as BoxesName);
            }
        }


        this.validations()

        console.log(this.Player_CheckedBoxes) 
        console.log("no of lines", this.LineCount)
    }
}