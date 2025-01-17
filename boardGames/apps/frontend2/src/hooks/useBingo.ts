import { useEffect, useState } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initialGameboard, setChecks, setIsLost, setIsMatchFound, setIsVictory, setMatchFoundData } from "@/store/slices/bingoSlice";
import { useNavigate } from "react-router-dom";
import {
  PUT_GAME_INIT,
  PUT_CANCEL_GAME_INIT,
  PUT_CHECK_MARK,
  GET_GAME,
  GET_RESPONSE,
  GET_CHECKBOXES,
  GET_CHECK_MARK,
  GET_VICTORY,
  GET_LOST,
  PUT_SEND_EMOTE,
  GET_RECIEVE_EMOTE,
  PAYLOAD_GET_RECIEVE_EMOTE,
} from "@repo/games/client/bingo/messages";
import { MessageType, PAYLOAD_GET_GAME, PAYLOAD_GET_RESPONSE, PAYLOAD_GET_CHECKBOXES, PAYLOAD_PUT_GET_CHECK_MARK, PAYLOAD_GET_VICTORY, PAYLOAD_GET_LOST } from "@repo/games/client/bingo/messages";
import { useDialogContext } from "@/context/DialogContext";

function useBingo() {
  const reduxState = useAppSelector((state) => ({
    gameBoard: state.bingo.game.gameBoard,
    checkedBoxes: state.bingo.checks.checkedBoxes,
    checkedLines: state.bingo.checks.checkedLines,
    gameId: state.bingo.game.gameId,
    players: state.bingo.game.players,

  }));

  const dispatch = useAppDispatch();
  const socket = useSocketContext();
  const navigate = useNavigate();

  // Dialog-related states

const {setIsVictory, isLost, isMatchFound, isVictory, lostData, matchFoundData, setIsLost, setIsMatchFound, setLostData, setMatchFoundData, setVictoryData, victoryData, emote, setEmote} = useDialogContext()
  // Sync Redux state for game-related logic
  const gameId = reduxState.gameId;
  const gameBoard = reduxState.gameBoard;
  const checkedBoxes = reduxState.checkedBoxes;
  const checkedLines = reduxState.checkedLines;
  let lastValue = "";
  const [response, setResponse] = useState<string>("");
  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const [isFinding, setIsFinding] = useState<boolean>(false);

  // Function to send data over socket
  const sendData = (type: string, payload: any) => {
    socket.send(JSON.stringify({ type, payload }));
  };

  useEffect(() => {
    if (!gameBoard) {
      setGameLoading(false);
    }
  }, [gameBoard]);

  // Handle receiving socket messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (message: MessageEvent) => {
      const parsedMessage = JSON.parse(message.data);
      switch (parsedMessage.type as MessageType) {
        case GET_RESPONSE: {
          const data = parsedMessage as PAYLOAD_GET_RESPONSE;
          setResponse(data.payload.message);
          break;
        }

        case GET_GAME: {
          const data = parsedMessage as PAYLOAD_GET_GAME;
          setIsFinding(false);
          dispatch(initialGameboard(data));
          setIsMatchFound(true);
          setMatchFoundData(data.payload.players);
          break;
        }

        case GET_CHECKBOXES: {
          const data = parsedMessage as PAYLOAD_GET_CHECKBOXES;
          dispatch(setChecks(data));
          break;
        }

        case GET_CHECK_MARK: {
          const data = parsedMessage as PAYLOAD_PUT_GET_CHECK_MARK;
          lastValue = data.payload.value
          break;
        }

        case GET_VICTORY: {
          const data = parsedMessage as PAYLOAD_GET_VICTORY;
          console.log('this is DAta', data)
          setIsVictory(true);
          break;
        }

        case GET_LOST: {
          setIsLost(true);
          break;
        }

        case GET_RECIEVE_EMOTE: {
          const data = parsedMessage as PAYLOAD_GET_RECIEVE_EMOTE;
          setEmote(data.payload.emote);
          break;
        }
      }
    };
  }, [socket, dispatch]);

  const findMatch = () => {
    setIsFinding(true);
    const token = localStorage.getItem("auth-token");
    sendData(PUT_GAME_INIT, { token });
  };

  const cancelFindMatch = () => {
    setIsFinding(false);
    sendData(PUT_CANCEL_GAME_INIT, {});
  };

  const addCheck = (value: string) => {
    sendData(PUT_CHECK_MARK, { gameId, value });
  };

  const sendEmote = (emote: string) => {
    sendData(PUT_SEND_EMOTE, { gameId, emote });
  }

  return {
    gameBoard,
    checkedBoxes,
    checkedLines,
    isFinding,
    gameId,
    isMatchFound,
    matchFoundData,
    gameLoading,
    response,
    emote,
    lastValue,
    isLost,
    isVictory,
    setIsVictory,
    setIsLost,
    findMatch,
    addCheck,
    sendEmote,
    cancelFindMatch,
  };
}

export default useBingo;