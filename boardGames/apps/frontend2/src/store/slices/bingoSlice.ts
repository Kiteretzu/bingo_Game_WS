import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, BoxesName, PAYLOAD_GET_CHECKBOXES, PAYLOAD_GET_GAME, PlayerData } from '@repo/games/client/bingo/messages';

// Define the initial state type
interface BingoState {
  game: {
    gameId: string;
    gameBoard: Box[] | null;
    players: PlayerData[];
  };
  checks: {
    checkedBoxes: BoxesName[] | null;
    checkedLines: BoxesName[][] | null;
  };
  dialog: {
    isMatchFound: boolean;
    matchFoundData: any | null;
    isVictory: boolean;
    victoryData: any | null;
    isLost: boolean;
    lostData: any | null;
  };
}

// Initial state
const initialState: BingoState = {
  game: {
    gameId: '',
    gameBoard: [],
    players: [],
  },
  checks: {
    checkedBoxes: [],
    checkedLines: [],
  },
  dialog: {
    isMatchFound: false,
    matchFoundData: null,
    isVictory: true,
    victoryData: null,
    isLost: false,
    lostData: null,
  },
};

// Create the slice
const bingoSlice = createSlice({
  name: 'bingo',
  initialState,
  reducers: {
    initialGameboard: (state, action: PayloadAction<PAYLOAD_GET_GAME>) => {
      state.game.gameBoard = action.payload.payload.gameBoard;
      state.game.gameId = action.payload.payload.gameId;
      state.game.players = action.payload.payload.players;
    },
    setChecks: (state, action: PayloadAction<PAYLOAD_GET_CHECKBOXES>) => {
      state.checks.checkedBoxes = action.payload.payload.checkedBoxes;
      state.checks.checkedLines = action.payload.payload.checkedLines;
    },
    setIsMatchFound: (state, action: PayloadAction<boolean>) => {
      state.dialog.isMatchFound = action.payload;
    },
    setMatchFoundData: (state, action: PayloadAction<any>) => {
      state.dialog.matchFoundData = action.payload;
    },
    setIsVictory: (state, action: PayloadAction<boolean>) => {
        console.log('in victory SLice',)
      state.dialog.isVictory = action.payload;
    },
    setVictoryData: (state, action: PayloadAction<any>) => {
      state.dialog.victoryData = action.payload;
    },
    setIsLost: (state, action: PayloadAction<boolean>) => {
      state.dialog.isLost = action.payload;
    },
    setLostData: (state, action: PayloadAction<any>) => {
      state.dialog.lostData = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  initialGameboard,
  setChecks,
  setIsMatchFound,
  setMatchFoundData,
  setIsVictory,
  setVictoryData,
  setIsLost,
  setLostData,
} = bingoSlice.actions;

export default bingoSlice.reducer;