/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice.store';
import LoginForm from '../../pages/LoginForm';
import * as firebaseAuth from 'firebase/auth';

// Mock firebase auth
jest.mock('firebase/auth');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const themeReducer = (state = { darkMode: false, useSystemTheme: false }, action) => {
  return state;
};

const renderLoginForm = () => {
  const store = configureStore({
    reducer: { 
      auth: authReducer,
      theme: themeReducer
    }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );
};

describe('LoginForm Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all elements', () => {
    renderLoginForm();
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@test.com',
      displayName: 'Test User'
    };

    firebaseAuth.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser
    });

    renderLoginForm();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles login error', async () => {
    firebaseAuth.signInWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/wrong-password'
    });

    renderLoginForm();

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
    });
  });
});
