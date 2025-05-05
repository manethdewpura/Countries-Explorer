import { createSlice } from "@reduxjs/toolkit";

// Slice for managing application theme preferences
const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: false, // Controls dark/light theme
    useSystemTheme: true, // Whether to use system preferences
  },
  reducers: {
    // Manually set dark mode and disable system theme preference
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      state.useSystemTheme = false;
    },
    // Enable system theme preference and set initial dark mode based on system
    setUseSystemTheme: (state) => {
      state.useSystemTheme = true;
      state.darkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    },
  },
});

export const { setDarkMode, setUseSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
