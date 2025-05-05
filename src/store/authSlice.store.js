import { createSlice } from "@reduxjs/toolkit";

// Auth slice manages user authentication state
// Persists user data in localStorage
const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Load user from localStorage or set to null if not found
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  },
  reducers: {
    // Set loading state when login process starts
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Update state with user data on successful login
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    // Handle login errors
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Clear user data and remove from localStorage
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
    },
  },
});

// Export actions and reducer for use in the application
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
