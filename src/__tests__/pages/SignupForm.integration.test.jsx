/* eslint-disable no-undef */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../../store/themeSlice.store';
import SignupForm from '../../pages/SignupForm';
import * as firebaseAuth from 'firebase/auth';

// Mock firebase auth methods
const mockAuth = { currentUser: null };
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn()
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderSignupForm = () => {
  const store = configureStore({
    reducer: {
      theme: themeReducer
    }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    </Provider>
  );
};

describe('SignupForm Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    firebaseAuth.getAuth.mockReturnValue(mockAuth);
  });

  test('renders signup form with all elements', () => {
    renderSignupForm();

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  test('handles successful signup', async () => {
    const mockUser = { uid: '123' };
    firebaseAuth.createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser
    });
    firebaseAuth.updateProfile.mockResolvedValueOnce();

    renderSignupForm();

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { name: 'name', value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@test.com',
        'password123'
      );
      expect(firebaseAuth.updateProfile).toHaveBeenCalledWith(
        mockUser,
        { displayName: 'Test User' }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error when passwords do not match', async () => {
    renderSignupForm();
    
    // Fill in form data
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { name: 'name', value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: 'password456' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('handles signup errors', async () => {
    firebaseAuth.createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: 'auth/email-already-in-use'
    });

    renderSignupForm();

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { name: 'name', value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('This email is already registered')).toBeInTheDocument();
    });
  });

  test('disables form fields during submission', async () => {
    firebaseAuth.createUserWithEmailAndPassword.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    renderSignupForm();

    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { name: 'name', value: 'Test User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByPlaceholderText('Full Name')).toBeDisabled();
    expect(screen.getByPlaceholderText('Email')).toBeDisabled();
    expect(screen.getByPlaceholderText('Password')).toBeDisabled();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeDisabled();
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
  });
});
