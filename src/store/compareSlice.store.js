import { createSlice } from "@reduxjs/toolkit";

// Slice for managing country comparison feature
const compareSlice = createSlice({
  name: "compare",
  initialState: {
    countries: [], // Array of countries being compared (max 3)
    isComparing: false, // Flag to track comparison mode
  },
  reducers: {
    // Add or remove country from comparison list
    toggleCompare: (state, action) => {
      const countryIndex = state.countries.findIndex(
        (c) => c.cca3 === action.payload.cca3
      );
      if (countryIndex > -1) {
        state.countries.splice(countryIndex, 1);
      } else if (state.countries.length < 3) {
        state.countries.push(action.payload);
      }
    },
    // Toggle comparison mode
    setComparing: (state, action) => {
      state.isComparing = action.payload;
    },
    // Reset comparison state
    clearComparison: (state) => {
      state.countries = [];
      state.isComparing = false;
    },
  },
});

export const { toggleCompare, setComparing, clearComparison } =
  compareSlice.actions;
export default compareSlice.reducer;
