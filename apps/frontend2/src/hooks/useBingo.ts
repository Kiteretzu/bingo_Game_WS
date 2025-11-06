import { useEffect, useState } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { registerMessageHandler } from "./useSocket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initialGameboard, setUpdatedGame } from "@/store/slices/bingoSlice";
import {
  PUT_CHECK_MARK,
  GET_RESPONSE,
  GET_CHECK_MARK,
  GET_VICTORY,
  GET_LOST,
  PUT_SEND_EMOTE,
  GET_RECIEVE_EMOTE,
  PAYLOAD_GET_RECIEVE_EMOTE,
  GET_UPDATED_GAME,
  PAYLOAD_GET_UPDATED_GAME,
  PUT_RESIGN,
  PAYLOAD_PUT_RESIGN,
  GET_RECONNECT,
  PAYLOAD_GET_RECONNECT,
  GET_REFRESH,
  GET_CHALLENGE,
  PAYLOAD_PUT_ADD_FRIEND,
  PUT_ADD_FRIEND,
  BoxesValue,
  PAYLOAD_PUT_SEND_EMOTE,
  GET_ADD_FRIEND,
  MessageType,
  PAYLOAD_GET_RESPONSE,
  PAYLOAD_PUT_GET_CHECK_MARK,
  PAYLOAD_GET_VICTORY,
  PAYLOAD_GET_LOST,
  PAYLOAD_PUT_TOSS_DECISION,
  PUT_TOSS_DECISION,
  TossDecision,
} from "@repo/messages/message";
import { useDialogContext } from "@/context/DialogContext";
import { useApolloClient } from "@apollo/client";
import {
  GetAllFriendRequestsDocument,
  GetGameHistoryDocument,
} from "@repo/graphql/types/client";

function useBingo() {
  const bingoState = useAppSelector((state) => ({
    gameBoard: state.bingo.game.gameBoard,
    checkedBoxes: state.bingo.checks.checkedBoxes,
    checkedLines: state.bingo.checks.checkedLines,
    gameId: state.bingo.game.gameId,
    playersData: state.bingo.game.players, // dont know where it will be used
    goals: state.bingo.goals,
    matchHistory: state.bingo.matchHistory,
    tossWinner: state.bingo.game.tossWinner,
    isGameStarted: state.bingo.game.isGameStarted,
  }));

  const profileState = useAppSelector((state) => ({
    isAuth: state.profile.isAuth,
    bingoProfileId: state.profile.bingoProfile?.id,
  }));

  const dispatch = useAppDispatch();
  const socket = useSocketContext()!; // no null should be come, it HAS to be webSocket

  // Dialog-related states

  const {
    setIsVictory,
    isLost,
    isReconnectGame,
    setIsReconnectGame,
    isVictory,
    lostData,
    setIsLost,
    setLostData,
    setVictoryData,
    victoryData,
    emote,
    isOpenChallenge,
    setIsOpenChallenge,
    setEmote,
    isOpenAddFriend,
    setIsOpenAddFriend,
  } = useDialogContext();
  // Sync Redux state for game-related logic
  const gameId = bingoState.gameId;
  const gameBoard = bingoState.gameBoard;
  const checkedBoxes = bingoState.checkedBoxes;
  const checkedLines = bingoState.checkedLines;
  const playersData = bingoState.playersData;
  const goals = bingoState.goals;
  const matchHistory = bingoState.matchHistory;
  const tossWinner = bingoState.tossWinner;
  const isTossWinner = tossWinner === profileState.bingoProfileId;
  const isGameStarted = bingoState.isGameStarted;
  const bingoProfileId = profileState.bingoProfileId;
  const isAuth = profileState.isAuth;

  let lastValue = ""; // i think bug state here
  const [response, setResponse] = useState<string>("");
  const [gameLoading, setGameLoading] = useState<boolean>(true);

  const client = useApolloClient();

  // delete this later on
  const displayName = useAppSelector((state) => state.profile.displayName);

  // Function to send data over socket
  const sendData = (type: string, payload: Record<string, unknown>) => {
    console.log('Message sent ✉️', { type, payload });
    socket.send(JSON.stringify({ type, payload }));
  };

  useEffect(() => {
    if (!gameBoard) {
      setGameLoading(false);
    }
  }, [gameBoard]);

  // Handle receiving socket messages using centralized callback system
  useEffect(() => {
    if (!socket) return;

    // Register message handler callback
    const unsubscribe = registerMessageHandler((parsedMessage) => {
      const message = parsedMessage as { type: MessageType; payload?: unknown };
      switch (message.type as MessageType) {
        case GET_RESPONSE: {
          const data = parsedMessage as unknown as PAYLOAD_GET_RESPONSE;
          setResponse(data.payload.message);
          console.log("RESPONSE:", data.payload.message);
          if (data.payload.message === "Ping") {
            socket.send(
              JSON.stringify({
                type: GET_RESPONSE,
                payload: { message: `Pong ${displayName}` },
              })
            );
          }
          break;
        }
        case GET_CHECK_MARK: {
          const data = parsedMessage as unknown as PAYLOAD_PUT_GET_CHECK_MARK;
          lastValue = data.payload.value; // i think bug state here
          break;
        }
        case GET_VICTORY: {
          const data = parsedMessage as unknown as PAYLOAD_GET_VICTORY;
          setVictoryData(data.payload);
          setIsVictory(true);
          setIsReconnectGame(false);

          client.refetchQueries({ include: [GetGameHistoryDocument] });
          break;
        }
        case GET_LOST: {
          const data = parsedMessage as unknown as PAYLOAD_GET_LOST;
          setLostData(data.payload);
          setIsLost(true);
          setIsReconnectGame(false);
          client.refetchQueries({
            include: [GetGameHistoryDocument],
          });

          break;
        }
        case GET_RECIEVE_EMOTE: {
          const data = parsedMessage as unknown as PAYLOAD_GET_RECIEVE_EMOTE;
          setEmote(data.payload.emote);
          break;
        }
        case GET_UPDATED_GAME: {
          const data = parsedMessage as unknown as PAYLOAD_GET_UPDATED_GAME;
          dispatch(setUpdatedGame(data));

          break;
        }
        case GET_RECONNECT: {
          const data = parsedMessage as unknown as PAYLOAD_GET_RECONNECT;
          console.log("THIS IS BINGO!! RECONNCET and data is", data);
          setIsReconnectGame(true);
          dispatch(initialGameboard(data));

          break;
        }
        case GET_REFRESH: {
          // refresh the page
          window.location.reload();

          break;
        }
        case GET_CHALLENGE: {
          console.log("get challenged");
          break;
        }
        case GET_ADD_FRIEND: {
          // show at realTime of ui!

          client
            .refetchQueries({
              include: [GetAllFriendRequestsDocument],
            })
            .then((res) => {
              console.log("✅ Friend requests refetched!", res);
              // do something after
            });
          break;
        }
      }
    });

    // Cleanup: unregister handler when component unmounts or socket changes
    return unsubscribe;
  }, [socket, dispatch, displayName, client]);

  const addCheck = (value: BoxesValue) => {
    const data: PAYLOAD_PUT_GET_CHECK_MARK["payload"] = { gameId, value };
    sendData(PUT_CHECK_MARK, data);
  };

  const sendEmote = (emote: string) => {
    const data: PAYLOAD_PUT_SEND_EMOTE["payload"] = { gameId, emote };
    sendData(PUT_SEND_EMOTE, data);
  };

  const sendResign = () => {
    const data: PAYLOAD_PUT_RESIGN["payload"] = { gameId };
    sendData(PUT_RESIGN, data);
  };

  const handleAddFriend = (data: PAYLOAD_PUT_ADD_FRIEND["payload"]) => {
    sendData(PUT_ADD_FRIEND, data);
  };

  const handleTossDecision = (decision: "FIRST" | "SECOND") => {
    const data: PAYLOAD_PUT_TOSS_DECISION["payload"] = {
      decision:
        decision === "FIRST"
          ? TossDecision.TOSS_GO_FIRST
          : TossDecision.TOSS_GO_SECOND,
    };
    sendData(PUT_TOSS_DECISION, data);
  };

  return {
    gameBoard,
    bingoProfileId,
    checkedBoxes,
    checkedLines,
    gameId,
    gameLoading,
    response,
    emote,
    lastValue,
    isLost,
    isVictory,
    tossWinner,
    // lostData,
    // victoryData,
    playersData, // same as matchFound data
    goals,
    matchHistory,
    victoryData,
    lostData,
    socket,
    isReconnectGame,
    isOpenChallenge,
    isOpenAddFriend,
    isAuth,
    isGameStarted,
    isTossWinner,
    handleAddFriend,
    handleTossDecision,
    setIsReconnectGame,
    setIsVictory, // for dialog
    setIsLost, // for dialog
    sendResign,
    addCheck,
    sendEmote,
    setIsOpenChallenge,
    setIsOpenAddFriend,
  };
}

export default useBingo;
