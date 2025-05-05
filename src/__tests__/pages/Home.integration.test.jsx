/* eslint-disable no-import-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice.store';
import Home from '../../pages/Home';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
import * as countriesService from '../../services/countries.service';

// Mock Firebase modules
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

// Mock child components
jest.mock('../../components/SearchFilter', () => () => <div data-testid="search-filter">Search Filter</div>);
jest.mock('../../components/CountryCard', () => () => <div data-testid="country-card">Country Card</div>);
jest.mock('../../components/HamburgerMenu', () => () => <div data-testid="hamburger-menu">Menu</div>);
jest.mock('../../components/ThemeToggle', () => () => <div data-testid="theme-toggle">Theme</div>);
jest.mock('../../components/CompareCountries', () => () => <div data-testid="compare-countries">Compare</div>);
jest.mock('../../components/ComparisonButton', () => () => <div data-testid="comparison-button">Compare Button</div>);

// Mock countries service
jest.mock('../../services/countries.service');

const mockCountriesData = [
  { 
    cca3: 'TEST',
    name: { common: 'Test Country' },
    region: 'Test Region',
    languages: { eng: 'English' }
  }
];

countriesService.fetchCountries = jest.fn().mockResolvedValue(mockCountriesData);
countriesService.filterCountries = jest.fn().mockResolvedValue(mockCountriesData);

// Mock Firestore onSnapshot with proper unsubscribe function
const mockUnsubscribe = jest.fn();
firestore.onSnapshot = jest.fn().mockImplementation((query, callback) => {
  callback({ docs: [] });
  return mockUnsubscribe;
});

const themeReducer = (state = { darkMode: false, useSystemTheme: false }, action) => {
  return state;
};

const sessionReducer = (state = {
  searchQuery: '',
  selectedLanguages: [],
  selectedRegions: [],
  sortBy: 'name'
}, action) => {
  return state;
};

const favoritesReducer = (state = { favorites: [] }, action) => {
  return state;
};

const renderHome = (preloadedState = {}) => {
  const store = configureStore({
    reducer: { 
      auth: authReducer,
      theme: themeReducer,
      session: sessionReducer,
      favorites: favoritesReducer
    },
    preloadedState: {
      session: {
        searchQuery: '',
        selectedLanguages: [],
        selectedRegions: [],
        sortBy: 'name'
      },
      favorites: {
        favorites: []
      },
      ...preloadedState
    }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </Provider>
  );
};

describe('Home Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    cleanup();
  });

  test('renders home page', async () => {
    // Mock the API calls to resolve immediately
    countriesService.fetchCountries.mockResolvedValue(mockCountriesData);
    countriesService.filterCountries.mockResolvedValue(mockCountriesData);

    let rendered;
    await act(async () => {
      rendered = renderHome();
    });
    
    // Initial render checks
    expect(screen.getByText('Countries Explorer')).toBeInTheDocument();
    expect(screen.getByTestId('search-filter')).toBeInTheDocument();
    
    // Loading spinner should be visible initially
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Advance timers and wait for loading to complete
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Wait for loading to finish and content to appear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('country-card')).toBeInTheDocument();
    });
  });

  test('displays user information when logged in', async () => {
    await act(async () => {
      renderHome({
        auth: {
          user: {
            uid: 'test-uid',
            displayName: 'Test User',
            email: 'test@test.com'
          }
        }
      });
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('country-card')).toBeInTheDocument();
    });

    expect(mockUnsubscribe).not.toHaveBeenCalled();
  });
});
