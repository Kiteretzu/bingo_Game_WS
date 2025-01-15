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
  PUT_GAME_INIT,
  PUT_CANCEL_GAME_INIT,
  PAYLOAD_PUT_CANCEL_GAME_INIT,
  GET_VICTORY,
} from "@repo/games/client/bingo/messages";
import { useEffect, useState } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initialGameboard, setChecks } from "@/store/slices/bingoSlice";
import { useNavigate } from "react-router-dom";
import { useDialogContext } from "@/context/DialogContext";

function useBingo() {
  const reduxState = useAppSelector((state) => ({
    gameBoard: state.bingo.game.gameBoard,
    checkedBoxes: state.bingo.checks.checkedBoxes,
    checkedLines: state.bingo.checks.checkedLines,
    gameId: state.bingo.game.gameId,
    players: state.bingo.game.players,
  }));

  const [gameId, setGameId] = useState(reduxState.gameId)
  const [players, setPlayers] = useState(reduxState.players)
  const [gameBoard, setGameBoard] = useState<Box[] | null>(reduxState.gameBoard);
  const [checkedBoxes, setCheckedBoxes] = useState<BoxesName[] | null>(reduxState.checkedBoxes);
  const [checkedLines, setCheckedLines] = useState<BoxesName[][] | null>(reduxState.checkedLines);

  const [lastValue, setLastValue] = useState<BoxesValue | "">("");
  const [response, setResponse] = useState<string>("");
  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const [socket] = useState<WebSocket>(useSocketContext());
  const [isFinding, setIsFinding] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setIsMatchFound, setMatchFoundData} = useDialogContext()

  // Function to send data over socket
  function sendData(type: string, payload: any) {
    socket.send(JSON.stringify({ type, payload }));
  }

  useEffect(() => {
    setGameBoard(reduxState.gameBoard);
    setCheckedBoxes(reduxState.checkedBoxes);
    setCheckedLines(reduxState.checkedLines);
  }, [reduxState.checkedBoxes, reduxState.checkedLines]);


  // Sync game board loading state when gameBoard is available
  useEffect(() => {
    if (!gameBoard) setGameLoading(false);
  }, [gameBoard]);

  // Handle receiving socket messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (message: MessageEvent) => {
      const parsedMessage = JSON.parse(message.data) as Message;
      console.log("parsedMessage: ", parsedMessage);

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
          setIsMatchFound(true)
          setMatchFoundData(data.payload.players)
          // navigate(`/game/${data.payload.gameId}`);
          break;
        }

        case GET_CHECKBOXES: {
          const data = parsedMessage as PAYLOAD_GET_CHECKBOXES;
          console.log('inHeree!!!',)
          dispatch(setChecks(data));
          break;
        }

        case GET_CHECK_MARK: {
          const data = parsedMessage as PAYLOAD_PUT_GET_CHECK_MARK;
          setLastValue(data.payload.value);
          break;
        }
        case GET_VICTORY: {
          console.log('hereeee VICTORY!!',)
          navigate("/victory")
        }
      }
    };
  }, [socket, dispatch, navigate]);

  const findMatch = () => {
    setIsFinding(true);
    const token = localStorage.getItem("auth-token")
    console.log('this is findMatch Token', token)
    sendData(PUT_GAME_INIT, { token });
  };

  const cancelFindMatch = () => {
    setIsFinding(false);
    sendData(PUT_CANCEL_GAME_INIT, {});
  };

  const addCheck = (value: BoxesValue) => {
    sendData(PUT_CHECK_MARK, { gameId, value });
  };

  return {
    socket,
    gameBoard,
    players,
    checkedBoxes,
    isFinding,
    checkedLines,
    gameId,
    gameLoading,
    response,
    lastValue,
    findMatch,
    addCheck,
    cancelFindMatch,
  };
}

export default useBingo;