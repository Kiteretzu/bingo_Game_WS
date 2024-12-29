import { BoxesName } from "./gameBoards";

export const boxes: BoxesName[] = []; // Initialized with an empty array
for (let i = 97; i <= 121; i++) { // ASCII values for 'a' (97) to 'y' (121)
  boxes.push(String.fromCharCode(i) as BoxesName)  // Fill boxes with 'a' to 'y'
}

export const possibleLines: BoxesName[][] = [];

/*
total possible vertical lines
[a,f,k,p,u,], [b,g,l,q,v],
[c,h,m,r,w], [d,i,n,s,x],
[e,j,o,t,y],

total possible horzintal lines
[a,b,c,d,e], [f,g,h,i,j]
[k,l,m,n,o], [p,q,r,s,t]
[u,v,w,x,y]

total diagnol lines
[a,g,m,s,y], [e,i,m,q,u]

overall ways = 12 ways

*/


// Add vertical lines
for (let i = 0; i < 5; i++) {
  const verticalLine:BoxesName[] = [];
  for (let j = 0; j < 5; j++) {
    verticalLine.push(boxes[i + j * 5]); // Calculate index for vertical line
  }
  possibleLines.push(verticalLine);
}

// Add horizontal lines
for (let i = 0; i < 5; i++) {
  const horizontalLine: BoxesName[] = [];
  for (let j = 0; j < 5; j++) {
    horizontalLine.push(boxes[i * 5 + j]); // Calculate index for horizontal line
  }
  possibleLines.push(horizontalLine);
}

// Add diagonal lines
const diagonal1: BoxesName[] = []; // Top-left to bottom-right
const diagonal2: BoxesName[] = []; // Top-right to bottom-left
for (let i = 0; i < 5; i++) {
  diagonal1.push(boxes[i * 6]); // Indexes: 0, 6, 12, 18, 24
  diagonal2.push(boxes[(i + 1) * 4]); // Indexes: 4, 8, 12, 16, 20
}
possibleLines.push(diagonal1, diagonal2);
