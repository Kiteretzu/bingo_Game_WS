import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useState, useEffect } from 'react';
import useSocketClient from './useSocketClient';
import { RootMessageType, GameType } from '@repo/messages/v2/message';
import { registerMessageHandler } from './useSocket';
import { initialGameboard } from '@/store/slices/bingoSlice';
import { useDialogContext } from '@/context/DialogContext';
import { GET_GAME, PAYLOAD_GET_GAME, MessageType } from '@repo/messages/message';

export const useMatchmaking = () => {
  const [isFinding, setIsFinding] = useState(false);
  const [isMatchFound, setIsMatchFound] = useState(false);
  const {gameSettings} = useAppSelector(state => state.profile)
  const {sendRootMessage} = useSocketClient()
  const dispatch = useAppDispatch();
  const { 
    setIsMatchFound: setDialogMatchFound, 
    setMatchFoundData,
    matchFoundData,
    isReconnectGame: dialogIsReconnectGame,
    isConfirmedMatch,
    setIsConfirmedMatch,
  } = useDialogContext();
  const bingoProfileId = useAppSelector(state => state.profile.bingoProfile?.id);

  // Register message handler for GET_GAME
  useEffect(() => {
    const unsubscribe = registerMessageHandler((parsedMessage) => {
      const message = parsedMessage as { type: MessageType; payload?: unknown };
      
      if (message.type === GET_GAME) {
        const data = parsedMessage as unknown as PAYLOAD_GET_GAME;
        console.log("this the get game DATA", data);
        setIsFinding(false); // removing -> ui
        dispatch(initialGameboard(data));
        setIsMatchFound(true); // giving ui -> CONFIRMING MATCH
        setDialogMatchFound(true); // also update dialog context
        setMatchFoundData(data.payload.players); // contextApi
        // setIsReconnectGame(true); // will be set in when confirmedMatch === true
      }
    });

    return unsubscribe;
  }, [dispatch, setDialogMatchFound, setMatchFoundData]);

  const findMatch = () => {
    setIsFinding(true);
    const token = localStorage.getItem("auth-token");
    if (token) {
      const {gameType, matchTier} = gameSettings;
      // Map gameType to GameType enum (both "BINGO" and "BINGO-6" map to BINGO)
      const mappedGameType = gameType === "BINGO" || gameType === "BINGO-6" 
        ? GameType.BINGO 
        : GameType.BINGO; // fallback to BINGO
      sendRootMessage({
        type: RootMessageType.START_MATCHMAKING,
        gameType: mappedGameType,
        payload: { token, matchTier },
      });
    }
  };

  const cancelFindMatch = () => {
    setIsFinding(false);
    setIsMatchFound(false);
  };

  return {
    findMatch,
    cancelFindMatch,
    isFinding,
    isReconnectGame: dialogIsReconnectGame,
    isMatchFound,
    matchFoundData,
    setIsMatchFound: setDialogMatchFound,
    setIsConfirmedMatch,
    isConfirmedMatch,
    bingoProfileId,
  };
};
