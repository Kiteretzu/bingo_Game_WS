import { configureStore } from '@reduxjs/toolkit';
import bingoReducer from "./slices/bingoSlice";
// Configure the store with the reducer(s)
export const store = configureStore({
  reducer: {
    bingo: bingoReducer,
  },
});

// Infer types for the store's state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;