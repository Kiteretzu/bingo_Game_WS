import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage
import { combineReducers } from 'redux';
import bingoReducer from './slices/bingoSlice';
import profileReducer from './slices/profileSlice'; // Example of another reducer

// Combine reducers (you can add more slices here)
const rootReducer = combineReducers({
  bingo: bingoReducer,
  profile: profileReducer,
});

// Redux Persist configuration for all slices
const persistConfig = {
  key: 'root',
  storage,
  // Optionally, use whitelist/blacklist to control persistence
  whitelist: ['profile'], // only profile presists
  blacklist: ['bingo'] 
};

// Create a persisted root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Persistor for persisting and rehydrating state
export const persistor = persistStore(store);

// Infer types for the store's state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;