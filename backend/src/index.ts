import { WebSocketServer } from 'ws';
import { boxes, possibleLines,  } from './util/boxes_and_ways';
import { BoxesName, BoxesValue, GameBoard } from './util/gameBoards';
import { BingoGame } from './util';

const game = new BingoGame();

export const ADD_VALUE_TO_BOX = "add_value_to_box";
export const ADD_CHECK_MARK = "add_check_mark";

const wss = new WebSocketServer({ port: 8080 });

const testArray2: string[] = ['a', 'b', 'c', 'd', 'f', 'k', 'p', 'u', 'e'];

console.log(possibleLines)




// console.log(checkSubarrayInTestArray(testArray2, possibleLines)); // Output: 2


wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString()); // Parse the received message
        
        if (message.type === ADD_VALUE_TO_BOX) {
            // Extract boxName and boxValue from message.data
            const boxName = Object.keys(message.data)[0] as BoxesName ; // "a"
            const boxValue_int = (Object.values(message.data)[0]) as BoxesValue // 2 (converted to string)

            // Call the method with extracted boxName and boxValue
            game.add_value_to_Box(boxName, boxValue_int);
        }

        if(message.type === ADD_CHECK_MARK ) {
            const value =  message.data as BoxesValue
            game.addCheckMark(value)
        }
    });

    // Send a message back to the client
    ws.send('something');
});