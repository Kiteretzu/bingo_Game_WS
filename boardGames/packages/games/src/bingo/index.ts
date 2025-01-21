import { boxes, possibleLines } from "./boxes_and_ways";
import { randomValuesForGameBoard } from "./gameBoards";
import { BoxesName, BoxesValue, GameBoard, Goals, GoalType } from "./messages";

export class Bingo {
  public lineCheckBoxes: BoxesName[][]; // An array of arrays for storing matched lines
  private gameOver: boolean;
  public LineCount: number; // Tracks the number of lines completed
  private checkedBoxes: BoxesName[]; // An array to keep track of checked boxes
  private gameBoard: GameBoard; // Game board containing box names and values
  private firstBlood: boolean;
  private doubleKill: boolean;
  private tripleKill: boolean;

  constructor() {
    this.LineCount = 0;
    this.lineCheckBoxes = [];
    this.checkedBoxes = [];
    this.gameBoard = new Array(25).fill({ boxName: "a", boxValue: "1" });
    randomValuesForGameBoard(this.gameBoard);
    this.gameOver = false;
    this.doubleKill = false;
    this.tripleKill = false;
    this.firstBlood = false;
    console.log("this is the BOARD!!", this.gameBoard);
  }

  setGameOver(val: boolean) {
    this.gameOver = val;
  }

  setFirstBlood(val: boolean) {
    this.firstBlood = val;
  }

  setDoubleKill(val: boolean) {
    this.doubleKill = val;
  }

  setTripleKill(val: boolean) {
    this.tripleKill = val;
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
    if (
      boxes.includes(boxName) &&
      Number(boxValue) >= 1 &&
      Number(boxValue) <= 25
    ) {
      const boxIndex = boxes.indexOf(boxName);
      if (boxIndex >= 0 && this.gameBoard[boxIndex]) {
        this.gameBoard[boxIndex] = {
          boxName,
          boxValue,
        };
      }
    } else {
      throw new Error("Invalid box name or value");
    }
    console.log("Updated game board:", this.gameBoard);
  }

  isVictory(): boolean {
    return this.LineCount >= 5; // A win is when 5 lines are completed
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  private validations(): void {
    let newLines = 0;

    // Iterate over all possible lines
    for (const possibleLine of possibleLines) {
      // Check if all boxes in the line are in checkedBoxes
      const isMatch = possibleLine.every((boxName) =>
        this.checkedBoxes.includes(boxName)
      );

      // Check if this line is already part of lineCheckBoxes
      const isAlreadyTracked = this.lineCheckBoxes.some(
        (trackedLine) =>
          JSON.stringify(trackedLine) === JSON.stringify(possibleLine)
      );

      // Add the line if it matches and is not already tracked
      if (isMatch && !isAlreadyTracked) {
        this.lineCheckBoxes.push(possibleLine);
        newLines++;
      }
    }

    this.LineCount += newLines;

    // console.log('Now the lineCount is', this.LineCount);

    if (this.LineCount >= 5) {
      console.log("Bingo game over with lineCount:", this.LineCount);
      this.gameOver = true;
    }
  }

  addCheckMark(boxValue: BoxesValue): void {
    if (this.gameOver) return;

    for (let i = 0; i < this.gameBoard.length; i++) {
      const box = this.gameBoard[i];
      if (box && box.boxValue === boxValue) {
        const boxName = box.boxName;

        if (this.checkedBoxes.includes(boxName)) {
          throw new Error(`${boxName} is already marked`);
        }

        this.checkedBoxes.push(boxName);
        break; // Avoid marking multiple boxes with the same value
      }
    }

    const newLines = this.checkNewLines(boxValue);

    // Handle doubleKill and thirdKill

    console.log("newLines here in addCheckMark", newLines);
    
    if (newLines === 2) {
      console.log("Double Kill unlocked!");
      this.setDoubleKill(true);
    }

    if (newLines === 3) {
      console.log("Triple Kill unlocked!");
      this.setTripleKill(true);
    }

    this.validations();
  }

  private checkNewLines(boxValue: BoxesValue): number {
    const box = this.gameBoard.find((b) => b.boxValue === boxValue);
    if (!box) return 0;

    let newLines = 0;

    for (const line of possibleLines) {
      if (line.includes(box.boxName) && !this.lineCheckBoxes.includes(line)) {
        const isMatch = line.every((name) => this.checkedBoxes.includes(name));
        if (isMatch) {
          newLines++;
        }
      }
    }

    return newLines;
  }

  isPerfectionist(): boolean {
    return this.checkedBoxes.length === 25 && this.LineCount === 5;
  }

  isDoubleKill(): boolean {
    return this.doubleKill;
  }
  isTripleKill(): boolean {
    return this.tripleKill;
  }

  isFirstBlood(): boolean {
    return this.firstBlood;
  }

  isRampage(): boolean {
    return this.LineCount > 6;
  }

  getGoals(): Goals[] {
    return [
      { goalName: GoalType.FIRST_BLOOD, isCompleted: this.isFirstBlood() },
      { goalName: GoalType.DOUBLE_KILL, isCompleted: this.isDoubleKill() },
      { goalName: GoalType.TRIPLE_KILL, isCompleted: this.isTripleKill() },
      { goalName: GoalType.PERFECTIONIST, isCompleted: this.isPerfectionist() },
      { goalName: GoalType.RAMPAGE, isCompleted: this.isRampage() },
    ];
  }
}
