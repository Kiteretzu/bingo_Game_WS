import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, BoxesName, Goals, GoalType, MatchHistory, PAYLOAD_GET_CHECKBOXES, PAYLOAD_GET_GAME, PAYLOAD_GET_RECONNECT, PAYLOAD_GET_UPDATED_GAME, PlayerData } from "@repo/games/mechanics";
import { Goal } from 'lucide-react';

// Define the initial state type
interface BingoState {
  game: {
    gameId: string;
    gameBoard: Box[] | null;
    players: PlayerData[];
    tossWinner: string;
  };
  checks: {
    checkedBoxes: BoxesName[] | null;
    checkedLines: BoxesName[][] | null;
  };
  goals: Goals[] // Goals stored as an array
  matchHistory: MatchHistory // Match history stored as an array;
}

// Initial state
const initialState: BingoState = {
  game: {
    gameId: '',
    gameBoard: [],
    players: [],
    tossWinner: '',
  },
  checks: {
    checkedBoxes: [],
    checkedLines: [],
  },
  goals: [
    {
      goalName: GoalType.FIRST_BLOOD,
      isCompleted: false,
    },
    {
      goalName: GoalType.DOUBLE_KILL,
      isCompleted: false,
    },
    {
      goalName: GoalType.TRIPLE_KILL,
      isCompleted: false,
    },
    {
      goalName: GoalType.RAMPAGE,
      isCompleted: false,
    },
    {
      goalName: GoalType.PERFECTIONIST,
      isCompleted: false,
    }
  ],
  matchHistory: []
};

// Create the slice
const bingoSlice = createSlice({
  name: 'bingo',
  initialState,
  reducers: {
    initialGameboard: (state, action: PayloadAction<PAYLOAD_GET_GAME | PAYLOAD_GET_RECONNECT>) => {
      state.game.gameBoard = action.payload.payload.gameBoard;
      state.game.gameId = action.payload.payload.gameId;
      state.game.players = action.payload.payload.players;
      state.game.tossWinner = action.payload.payload.tossWinner;

    },
    setUpdatedGame: (state, action: PayloadAction<PAYLOAD_GET_UPDATED_GAME>) => {
      state.checks.checkedBoxes = action.payload.payload.checks.checkedBoxes;
      state.checks.checkedLines = action.payload.payload.checks.checkedLines;
      state.goals = action.payload.payload.goals;
      state.matchHistory = action.payload.payload.matchHistory;

      console.log('this is match History', state.matchHistory)
    }
    
  },
});

// Export actions and reducer
export const {
  initialGameboard,
  setUpdatedGame,
} = bingoSlice.actions;

export default bingoSlice.reducer;