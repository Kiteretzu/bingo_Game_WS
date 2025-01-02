import {
  PUT_VALUE_TO_BOX,
  MessageType,
  PUT_CHECK_MARK,
  GET_GAME,
  GET_RESPONSE,
  Box,
  BoxesName,
  Message,
  PAYLOAD_GET_RESPONSE,
  PAYLOAD_GET_GAME,
  GET_CHECKBOXES,
  PAYLOAD_GET_CHECKBOXES,
  PAYLOAD_PUT_GET_CHECK_MARK,
  GET_CHECK_MARK,
  BoxesValue,
  PAYLOAD_PUT_GAME_INIT,
  PUT_GAME_INIT
} from "@repo/games/client/bingo/messages";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { useSocketContext } from "@/context/SocketContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initialGameboard, setChecks } from "@/store/slices/bingoSlice";
import { useActionData } from "react-router-dom";


function useGame() {


  const [gameBoard, setGameBoard] = useState<Box[] | null>(useAppSelector(state => state.bingo.game.gameBoard));
  const [checkedBoxes, setCheckedBoxes] = useState<BoxesName[] | null>(useAppSelector(state => state.bingo.checks.checkedBoxes));
  const [checkedLines, setCheckedLines] = useState<BoxesName[][] | null>(useAppSelector(state => state.bingo.checks.checkedLines));
  const [gameId, setGameId] = useState<string>(useAppSelector(state => state.bingo.game.gameId))
  const [players, setPlayers] = useState(useAppSelector(state => state.bingo.game.players))
  const [lastValue, setLastValue] = useState<BoxesValue| "">("")
  const [response, setResponse] = useState<string>("")
  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState(useSocketContext())
  

  const dispatch = useAppDispatch();
  
  if(!gameBoard) setGameLoading(false)

    // all the reciving logics
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (message: MessageEvent) => {
      const parsedMessage = JSON.parse(message.data) as Message
      console.log("parsedMessage: ", parsedMessage);


      switch (parsedMessage.type as MessageType) {

        case GET_RESPONSE: {
          const data = parsedMessage as PAYLOAD_GET_RESPONSE
          setResponse(data.payload.message)
          break;
        }

        case GET_GAME: {
          const data = parsedMessage as PAYLOAD_GET_GAME
          console.log('got message from get game',)
          dispatch(initialGameboard(data))
          break;
        }
        case GET_CHECKBOXES: {
          const data = parsedMessage as PAYLOAD_GET_CHECKBOXES
          dispatch(setChecks(data))
          break;
        }
        // rare case maybe use for setting response
        case GET_CHECK_MARK: {
          const data = parsedMessage as PAYLOAD_PUT_GET_CHECK_MARK
          setLastValue(data.payload.value)
        }
      }
    };

  }, [socket]);

  // temperaory sending string, in future just send userId
  const findMatch  = (name: string) => {
    const sendingData : PAYLOAD_PUT_GAME_INIT = {
      type: PUT_GAME_INIT,
      payload: {
        data: name
      }
    }
    socket.send(JSON.stringify(sendingData))
  }

  const addCheck = (value: BoxesValue) => {
    const sendingData : PAYLOAD_PUT_GET_CHECK_MARK = {
      type: PUT_CHECK_MARK,
      payload: {
        gameId: gameId,
        value
      }
    }

    socket.send(JSON.stringify(sendingData))
  }


  return {
    socket,
    gameBoard,
    checkedBoxes,
    checkedLines,
    gameId,
    gameLoading,
    response,
    lastValue,
    findMatch,
    addCheck
  };
}

export default useGame;
