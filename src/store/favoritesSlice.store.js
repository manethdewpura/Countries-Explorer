import { createSlice } from "@reduxjs/toolkit";

// Initial state for favorites management
const initialState = {
  items: [], // Array of favorite countries
  favoriteIds: [], // Array of country codes for quick lookup
  loading: false,
  error: null,
};

// Slice for managing user's favorite countries
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Update favorites list and extract IDs for quick access
    setFavorites: (state, action) => {
      state.items = action.payload;
      state.favoriteIds = action.payload.map((item) => item.countryCode);
      state.loading = false;
      state.error = null;
    },
    // Toggle loading state during async operations
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Handle and store error states
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions and reducer for favorites management
export const { setFavorites, setLoading, setError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
