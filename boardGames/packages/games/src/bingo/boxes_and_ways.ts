import { BoxesName } from "@repo/messages/message";

export const boxes: BoxesName[] = []; // Initialized with an empty array

// Populate the boxes array with 'a' to 'y'
for (let i = 97; i <= 121; i++) { // ASCII values for 'a' (97) to 'y' (121)
  boxes.push(String.fromCharCode(i) as BoxesName);  // Fill boxes with 'a' to 'y'
}

export const possibleLines: BoxesName[][] = [];

// Add vertical lines
for (let i = 0; i < 5; i++) {
  const verticalLine: BoxesName[] = [];
  for (let j = 0; j < 5; j++) {
    const box = boxes[i + j * 5];
    if (box) {
      verticalLine.push(box); // Add only if it's not undefined
    }
  }
  possibleLines.push(verticalLine);
}

// Add horizontal lines
for (let i = 0; i < 5; i++) {
  const horizontalLine: BoxesName[] = [];
  for (let j = 0; j < 5; j++) {
    const box = boxes[i * 5 + j];
    if (box) {
      horizontalLine.push(box); // Add only if it's not undefined
    }
  }
  possibleLines.push(horizontalLine);
}

// Add diagonal lines
const diagonal1: BoxesName[] = []; // Top-left to bottom-right
const diagonal2: BoxesName[] = []; // Top-right to bottom-left

for (let i = 0; i < 5; i++) {
  const box1 = boxes[i * 6];
  if (box1) {
    diagonal1.push(box1); // Add only if it's not undefined
  }

  const box2 = boxes[(i + 1) * 4];
  if (box2) {
    diagonal2.push(box2); // Add only if it's not undefined
  }
}

possibleLines.push(diagonal1, diagonal2);