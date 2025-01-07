import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetProfileQuery } from '@repo/graphql/types/client';

// Define the bingo profile type
type Maybe<T> = T | null | undefined;

interface BingoProfile {
  totalMatches: Maybe<number>;
  wins: Maybe<number>;
  losses: Maybe<number>;
  league: Maybe<string>;
}

// Define the profile state type
interface ProfileState {
  displayName: Maybe<string>;
  email: Maybe<string>;
  avatar: Maybe<string>;
  bingoProfile: BingoProfile;
}

// Initial state
const initialState: ProfileState = {
  displayName: null,
  email: null,
  avatar: null,
  bingoProfile: {
    totalMatches: null,
    wins: null,
    losses: null,
    league: null,
  },
};

// Create the slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<GetProfileQuery | undefined>) => {
      const authUser = action.payload?.authUser

      // Mutate the state directly
      console.log('this is', action.payload)
      if (authUser) {
        state.displayName = authUser.displayName ?? null;
        state.email = authUser.email ?? null;
        state.avatar = authUser.avatar ?? null;
        state.bingoProfile = {
          totalMatches: authUser.bingoProfile?.totalMatches ?? null,
          wins: authUser.bingoProfile?.wins ?? null,
          losses: authUser.bingoProfile?.losses ?? null,
          league: authUser.bingoProfile?.league ?? null,
        };
      }
    },
  },
});

// Export actions and reducer
export const { initialize } = profileSlice.actions;
export default profileSlice.reducer;