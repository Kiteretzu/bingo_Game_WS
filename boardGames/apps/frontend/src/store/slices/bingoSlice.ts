import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, BoxesName, PAYLOAD_GET_CHECKBOXES } from '@repo/games/client/bingo/messages';

// Define the initial state type
interface CounterState {
  gameBoard: Box[];
  checkedBoxes: BoxesName[]
  checkedLines: BoxesName[][]
}

// Initial state
const initialState: CounterState = {
  gameBoard: [],
  checkedBoxes: [],
  checkedLines: [],
};

// Create the slice
const bingoSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    initialGameboard: (state, action: PayloadAction<Box[]>) => {
        state.gameBoard = action.payload
    },
    setChecks: (state, action: PayloadAction<PAYLOAD_GET_CHECKBOXES>) => {
        state.checkedBoxes = action.payload.payload.checkedBoxes
        state.checkedLines = action.payload.payload.checkedLines
    },
  },
});

// Export actions and reducer
export const { initialGameboard, setChecks } = bingoSlice.actions;
export default bingoSlice.reducer;