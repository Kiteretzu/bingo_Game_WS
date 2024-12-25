import { boxes, possibleLines } from "./boxes_and_ways";
import { BoxesName, BoxesValue, GameBoard, randomValuesForGameBoard } from "./gameBoards";

export class Bingo {
    private checkedBoxes: BoxesName[] = [];
    private gameBoard: Partial<GameBoard> = {}; // gameBoard is a partial representation of the full GameBoard
    private LineCount : number;
    constructor() {
        // Initialize the board using the provided function
        this.LineCount = 0
        randomValuesForGameBoard(this.gameBoard);
    }
    
    getGameBoard(){
        return this.gameBoard
    }
    getCheckBoxes () {
        return this.checkedBoxes
    }

    add_value_to_Box(boxName: BoxesName, boxValue: BoxesValue): void {
        // Ensure the box name and value are valid
        if (boxes.includes(boxName) && Number( boxValue )>= 1 && Number( boxValue) <= 25) {
            // Assert the boxName is a valid key of GameBoard
            this.gameBoard[boxName as keyof GameBoard] = boxValue as GameBoard[keyof GameBoard];
        } else {
            throw new Error("Invalid box name or value");
        }
        console.log('this is changed board', this.gameBoard);
    }

    isVictory(): Boolean {
        return this.LineCount>=5
    }
    
    private  validations(): void {
          let validCount = 0; // Counter to track valid subarrays
        
          // Iterate through each subarray in possibleLines
          for (let i = 0; i < possibleLines.length; i++) {
            let isMatch = true;
            
            // Check if all elements of the current subarray are included in testArray
            for (let j = 0; j < possibleLines[i].length; j++) {
              if (!this.checkedBoxes.includes(possibleLines[i][j])) {
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
          if( this.isVictory()) throw new Error("Game has been won")
        }

    addCheckMark(boxValue: BoxesValue): void {
        // Iterate over the gameBoard keys with the correct type assertion
        for (const key in this.gameBoard) {
            // TypeScript assumes `key` is a string, but we want to ensure it's a key of GameBoard
            if (this.gameBoard.hasOwnProperty(key) && this.gameBoard[key as BoxesName ] as BoxesValue === boxValue) {
                // Push the key (box name) into Player_CheckedBoxes
                if(this.checkedBoxes.includes(key as BoxesName)) throw new Error(`${key} is already marked`)
                    
                this.checkedBoxes.push(key as BoxesName);
            }
        }

        this.validations()

        console.log(this.checkedBoxes) 
        console.log("no of lines", this.LineCount)
    }

    
}