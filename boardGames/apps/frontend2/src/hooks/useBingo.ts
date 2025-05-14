import { useEffect, useState } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initialGameboard, setUpdatedGame } from "@/store/slices/bingoSlice";
import {
  PUT_GAME_INIT,
  PUT_CANCEL_GAME_INIT,
  PUT_CHECK_MARK,
  GET_GAME,
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
  PUT_CHALLENGE,
  GET_CHALLENGE,
  PAYLOAD_PUT_ADD_FRIEND,
  PUT_ADD_FRIEND,
  PAYLOAD_PUT_GAME_INIT,
  BoxesValue,
  PAYLOAD_PUT_SEND_EMOTE,
  GET_ADD_FRIEND,
  MessageType,
  PAYLOAD_GET_GAME,
  PAYLOAD_GET_RESPONSE,
  PAYLOAD_PUT_GET_CHECK_MARK,
  PAYLOAD_GET_VICTORY,
  PAYLOAD_GET_LOST,
} from "@repo/messages/message";
import { useDialogContext } from "@/context/DialogContext";
import { useApolloClient } from "@apollo/client";
import {
  GetAllFriendRequestsDocument,
  GetGameHistoryDocument,
  useGetBingoPlayerRecordsQuery,
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
    gameHistory: state.profile.gameHistory,
  }));

  const dispatch = useAppDispatch();
  const socket = useSocketContext()!; // no null should be come, it HAS to be webSocket

  // Dialog-related states

  const {
    setIsVictory,
    isLost,
    isMatchFound,
    isReconnectGame,
    setIsReconnectGame,
    isVictory,
    lostData,
    matchFoundData,
    setIsLost,
    setIsMatchFound,
    setLostData,
    setMatchFoundData,
    setVictoryData,
    victoryData,
    emote,
    isOpenChallenge,
    setIsOpenChallenge,
    setEmote,
    isOpenAddFriend,
    setIsOpenAddFriend,
    isConfirmedMatch,
    setIsConfirmedMatch,
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
  const isGameStarted = bingoState.isGameStarted;
  const bingoProfileId = profileState.bingoProfileId;
  const gameHistory = profileState.gameHistory;
  const isAuth = profileState.isAuth;

  let lastValue = ""; // i think bug state here
  const [response, setResponse] = useState<string>("");
  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const [isFinding, setIsFinding] = useState<boolean>(false);

  const client = useApolloClient();

  // delete this later on
  const displayName = useAppSelector((state) => state.profile.displayName);

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
      console.log("this is parsed onMessage", parsedMessage);
      switch (parsedMessage.type as MessageType) {
        case GET_RESPONSE: {
          const data = parsedMessage as PAYLOAD_GET_RESPONSE;
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
        case GET_GAME: {
          const data = parsedMessage as PAYLOAD_GET_GAME;
          console.log("this the get game DATA", data);
          setIsFinding(false); // removing -> ui
          dispatch(initialGameboard(data));
          setIsMatchFound(true); // giving ui -> CONFIRMING MATCH
          setMatchFoundData(data.payload.players); // contextApi
          // setIsReconnectGame(true); // will be set in when confirmedMatch === true
          break;
        }
        case GET_CHECK_MARK: {
          const data = parsedMessage as PAYLOAD_PUT_GET_CHECK_MARK;
          lastValue = data.payload.value; // i think bug state here
          break;
        }
        case GET_VICTORY: {
          const data = parsedMessage as PAYLOAD_GET_VICTORY;
          setVictoryData(data.payload);
          setIsVictory(true);
          setIsReconnectGame(false);
          client.refetchQueries({ include: [GetGameHistoryDocument] });
          break;
        }
        case GET_LOST: {
          const data = parsedMessage as PAYLOAD_GET_LOST;
          setLostData(data.payload);
          setIsLost(true);
          setIsReconnectGame(false);
          client.refetchQueries({
            include: [GetGameHistoryDocument],
          });

          break;
        }
        case GET_RECIEVE_EMOTE: {
          const data = parsedMessage as PAYLOAD_GET_RECIEVE_EMOTE;
          setEmote(data.payload.emote);
          break;
        }
        case GET_UPDATED_GAME: {
          const data = parsedMessage as PAYLOAD_GET_UPDATED_GAME;
          dispatch(setUpdatedGame(data));

          break;
        }
        case GET_RECONNECT: {
          const data = parsedMessage as PAYLOAD_GET_RECONNECT;
          console.log("THIS IS BINGO!! RECONNCET and data is", data);
          setIsReconnectGame(true);
          dispatch(initialGameboard(data));

          break;
        }
        case GET_REFRESH: {
          cancelFindMatch();
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
          console.log("got add friend", parsedMessage);
          setInterval(() => {
            client
              .refetchQueries({
                include: [GetAllFriendRequestsDocument],
              })
              .then((res) => {
                console.log("✅ Friend requests refetched!", res);
                // do something after
              });
          }, 1000);
          console.log("called AFTER REFETCH QUERIES");
          break;
        }
      }
    };
  }, [socket, dispatch]);

  const findMatch = (selectedMode: string, selectedTier: string) => {
    setIsFinding(true);
    const token = localStorage.getItem("auth-token");
    if (token) {
      const data: PAYLOAD_PUT_GAME_INIT["payload"] = {
        token,
        gameType:
          selectedMode == "Classic" ? "BINGO" : (selectedMode as "BINGO"),
        matchTier: selectedTier.split(" ")[1] as
          | "A"
          | "B"
          | "C"
          | "D"
          | "E"
          | "F",
      }; // it must come from authenticated user that it is not jwt expired
      sendData(PUT_GAME_INIT, data);
    }
  };

  const cancelFindMatch = () => {
    setIsFinding(false);
    sendData(PUT_CANCEL_GAME_INIT, {});
  };

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

  return {
    gameBoard,
    bingoProfileId,
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
    gameHistory,
    isOpenChallenge,
    isOpenAddFriend,
    isConfirmedMatch,
    isAuth,
    isGameStarted,
    setIsConfirmedMatch,
    handleAddFriend,
    setIsReconnectGame,
    setIsVictory, // for dialog
    setIsLost, // for dialog
    setIsMatchFound, // to turn off dialog after you go back to homePage
    findMatch,
    sendResign,
    addCheck,
    sendEmote,
    cancelFindMatch,
    setIsOpenChallenge,
    setIsOpenAddFriend,
  };
}

export default useBingo;
