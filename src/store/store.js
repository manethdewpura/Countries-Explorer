import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.store";
import favoritesReducer from "./favoritesSlice.store";
import themeReducer from "./themeSlice.store";
import recentlyViewedReducer from "./recentlyViewedSlice.store";
import compareReducer from "./compareSlice.store";

// Default session state for filters and sorting
const initialState = {
  searchQuery: "",
  selectedLanguages: [],
  selectedRegions: [],
  sortBy: "name",
};

// Load persisted state from localStorage
const preloadedState = {
  session: {
    ...initialState,
    ...JSON.parse(localStorage.getItem("session") || "{}"),
  },
  theme: {
    darkMode: JSON.parse(localStorage.getItem("darkMode") || "false"),
    useSystemTheme: JSON.parse(
      localStorage.getItem("useSystemTheme") || "true"
    ),
  },
};

export const store = configureStore({
  reducer: {
    // Session reducer handles search, filters, and sorting
    session: (state = initialState, action) => {
      switch (action.type) {
        case "session/setSearchQuery":
          // Update search query
          return { ...state, searchQuery: action.payload };
        case "session/addLanguageFilter":
          // Add unique language filter
          return {
            ...state,
            selectedLanguages: [
              ...new Set([...(state.selectedLanguages || []), action.payload]),
            ],
          };
        case "session/removeLanguageFilter":
          // Remove specific language filter
          return {
            ...state,
            selectedLanguages: (state.selectedLanguages || []).filter(
              (lang) => lang !== action.payload
            ),
          };
        case "session/addRegionFilter":
          // Toggle region filter
          return {
            ...state,
            selectedRegions: (state.selectedRegions || []).includes(
              action.payload
            )
              ? (state.selectedRegions || []).filter(
                  (r) => r !== action.payload
                )
              : [...(state.selectedRegions || []), action.payload],
          };
        case "session/removeRegionFilter":
          // Remove specific region filter
          return {
            ...state,
            selectedRegions: (state.selectedRegions || []).filter(
              (region) => region !== action.payload
            ),
          };
        case "session/clearFilters":
          // Reset all filters
          return { ...state, selectedLanguages: [], selectedRegions: [] };
        case "session/setSortBy":
          // Update sort criteria
          return { ...state, sortBy: action.payload };
        default:
          return state;
      }
    },
    // Feature-specific reducers
    auth: authReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
    recentlyViewed: recentlyViewedReducer,
    compare: compareReducer,
  },
  preloadedState,
});

// Persist relevant state to localStorage on store updates
store.subscribe(() => {
  localStorage.setItem("session", JSON.stringify(store.getState().session));
  localStorage.setItem(
    "darkMode",
    JSON.stringify(store.getState().theme.darkMode)
  );
  localStorage.setItem(
    "useSystemTheme",
    JSON.stringify(store.getState().theme.useSystemTheme)
  );
});
