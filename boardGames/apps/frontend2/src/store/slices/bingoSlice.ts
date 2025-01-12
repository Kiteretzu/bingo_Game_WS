import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, BoxesName, PAYLOAD_GET_CHECKBOXES, PAYLOAD_GET_GAME, PlayerData } from '@repo/games/client/bingo/messages';

// Define the initial state type
interface BingoState {
    game: {
        gameId: string
        gameBoard: Box[] | null;
        players: PlayerData[]
    }
    checks: {
        checkedBoxes: BoxesName[] | null;
        checkedLines: BoxesName[][] | null;
    }
}
// Initial state
const initialState: BingoState = {
    game: {
        gameId: "",
        gameBoard: [],
        players: []
    },
    checks: {
        checkedBoxes: [],
        checkedLines: []
    }
};

// Create the slice
const bingoSlice = createSlice({
  name: 'bingo',
  initialState,
  reducers: {
    initialGameboard: (state, action: PayloadAction<PAYLOAD_GET_GAME>) => {
        state.game.gameBoard = action.payload.payload.gameBoard
        state.game.gameId = action.payload.payload.gameId
        state.game.players = action.payload.payload.players
    },
    setChecks: (state, action: PayloadAction<PAYLOAD_GET_CHECKBOXES>) => {
        state.checks.checkedBoxes = action.payload.payload.checkedBoxes
        state.checks.checkedLines = action.payload.payload.checkedLines
    },
  },
});

// Export actions and reducer
export const { initialGameboard, setChecks } = bingoSlice.actions;
export default bingoSlice.reducer;