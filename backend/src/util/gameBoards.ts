import { boxes } from "./boxes_and_ways";

// Define the box names from 'a' to 'y'
export type BoxesName = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y';

// Define the possible values for each box, from '1' to '25'
export type BoxesValue = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25';

// Define the game board type
export type GameBoard = Record<BoxesName, BoxesValue>;

// Initialize the game board as a Partial object to allow incremental population
export const Player_CheckedBoxes: BoxesName[] = [];

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to randomly assign shuffled values to boxes
export function randomValuesForGameBoard(gameBoard: Partial<GameBoard>) {
    // Create an array of numbers from 1 to 25
    const values = Array.from({ length: 25 }, (_, i) => i + 1);

    // Shuffle the array
    const shuffledValues = shuffleArray(values);

    // Assign shuffled values to boxes
    for (let i = 0; i < boxes.length; i++) {
        const boxName = boxes[i] as BoxesName; // Assert the type to match BoxesName
        gameBoard[boxName] = shuffledValues[i].toString() as BoxesValue; // Assign shuffled value
    }
}

