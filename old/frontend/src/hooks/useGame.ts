/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ADD_CHECK_MARK,
  ADD_VALUE_TO_BOX,
  GAME_INIT,
  MessageType,
  SEND_CHECKBOXES,
  SEND_GAMEBOARD,
} from "@/assets/constants";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

interface SendingData {
  type: MessageType;
  data: any;
}

function useGame() {
  const [gameBoard, setGameBoard] = useState<null | any>(null);
  const [checkedBoxes, setCheckedBoxes] = useState<null | any>(null);
  const [checkedLines, setCheckedLines] = useState<null | any>(null);
    const socket = useSocket()

  useEffect(() => {
    if(!socket) return
    socket.onmessage = (message: MessageEvent) => {
      switch (message.type as MessageType) {
        case SEND_GAMEBOARD: {
          console.log("hello in here case send gameboard");
          setGameBoard(message.data);
          break;
        }
        case SEND_CHECKBOXES: {
          setCheckedBoxes(message.data.checkedBoxes);
          setCheckedLines(message.data.checkedLines);
          break;
        }
      }
    };
  }, [socket]);

  const sendData = (type: MessageType, value: string) => {
    if(!socket) return
    switch (type) {
      case ADD_CHECK_MARK: {
        const sendingData: SendingData = {
          type,
          data: value,
        };
        socket.send(JSON.stringify(sendingData));
        break;
      }
      case ADD_VALUE_TO_BOX: {
        const sendingData: SendingData = {
          type,
          data: "lol",
        };
        socket.send(JSON.stringify(sendingData));
        break;
      }

      case GAME_INIT: {
        console.log('here',)
        const sendingData : SendingData = {
            type,
            data: value
        }
        console.log('this is data', sendingData)
        socket.send(JSON.stringify(sendingData))
      }
    }
  };

  return { gameBoard, checkedBoxes, checkedLines, sendData };
}

export default useGame;
