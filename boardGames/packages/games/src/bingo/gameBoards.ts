import { BoxesValue, GameBoard } from "@repo/messages/message";
import { boxes } from "./boxes_and_ways";


// Initialize the game board as an empty array of Boxes
export const gameBoard: GameBoard = new Array(25).fill(null).map(() => ({
  boxName: 'a', // Placeholder, to be replaced
  boxValue: '1' // Placeholder, to be replaced
}));

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to randomly assign shuffled values to boxes
export function randomValuesForGameBoard(gameBoard: GameBoard) {
    // Create an array of numbers from 1 to 25
    const values :number[] = Array.from({ length: 25 }, (_, i) => i + 1);

    // Shuffle the array
    const shuffledValues = shuffleArray(values) as number[]
    boxes.forEach((boxName, index) => {
        const boxValue = shuffledValues[index]?.toString() as BoxesValue; // Get the shuffled value and cast it
        // Ensure the game board has the correct structure and assign the shuffled value
        gameBoard[index] = { boxName, boxValue };
    });
}