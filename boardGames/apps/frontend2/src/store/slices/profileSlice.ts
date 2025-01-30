import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetAuthProfileQuery } from "@repo/graphql/types/client";

interface BingoProfile {
  totalMatches?: number;
  wins?: number;
  losses?: number;
  league?: string;
}

// Define the profile state type
interface ProfileState {
  isAuth: boolean;
  googleId: string
  displayName?: string;
  email?: string;
  avatar?: string;
  bingoProfile?: BingoProfile;
}

// Initial state
const initialState: ProfileState = {
  isAuth: false,
  displayName: "",
  googleId: "",
  email: "",
  avatar: "",
  bingoProfile: {
    totalMatches: 0,
    wins: 0,
    losses: 0,
    league: "",
  },
};

// Create the slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    initialize: (
      state,
      action: PayloadAction<GetAuthProfileQuery | undefined>
    ) => {
      if (!action.payload) {
        return initialState; // Reset state directly
      }
      const authUser = action.payload?.authUser;

      // Mutate the state directly
      if (authUser) {
        state.isAuth = true; // Mark user as authenticated
        state.googleId = authUser.googleId;
        state.displayName = authUser.displayName ?? undefined;
        state.email = authUser.email ?? undefined;
        state.avatar = authUser.avatar ?? undefined;
        state.bingoProfile = {
          totalMatches: authUser.bingoProfile?.totalMatches ?? undefined,
          wins: authUser.bingoProfile?.wins ?? undefined,
          losses: authUser.bingoProfile?.losses ?? undefined,
          league: authUser.bingoProfile?.league ?? undefined,
        };
      }
    },
    logout: () => {
      localStorage.removeItem('auth-token')
      return initialState
    }, // Reset state to initial values
  },
});

// Export actions and reducer
export const { initialize, logout } = profileSlice.actions;
export default profileSlice.reducer;
