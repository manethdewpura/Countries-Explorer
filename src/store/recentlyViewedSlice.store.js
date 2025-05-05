import { createSlice } from "@reduxjs/toolkit";

// Slice for managing recently viewed countries
const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: {
    countries: [], // Array of recently viewed countries (max 10)
  },
  reducers: {
    // Add country to recently viewed list
    // Removes duplicates and maintains max size of 10
    addRecentlyViewed: (state, action) => {
      const country = action.payload;
      state.countries = state.countries.filter((c) => c.cca3 !== country.cca3);
      state.countries.unshift(country);
      if (state.countries.length > 10) {
        state.countries.pop();
      }
    },
    // Clear all recently viewed countries
    clearRecentlyViewed: (state) => {
      state.countries = [];
    },
  },
});

export const { addRecentlyViewed, clearRecentlyViewed } =
  recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
