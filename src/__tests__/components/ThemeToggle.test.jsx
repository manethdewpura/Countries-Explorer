/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ThemeToggle from '../../components/ThemeToggle';

const mockStore = configureStore([]);

describe('ThemeToggle', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      theme: {
        darkMode: false,
        useSystemTheme: false
      }
    });
  });

  it('renders theme toggle button', () => {
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>
    );

    expect(screen.getByLabelText('Theme settings')).toBeInTheDocument();
  });

  it('toggles theme menu on button click', () => {
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Theme settings'));
    
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('dispatches setDarkMode when dark mode is selected', () => {
    render(
      <Provider store={store}>
        <ThemeToggle />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Theme settings'));
    fireEvent.click(screen.getByText('Dark Mode'));

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'theme/setDarkMode',
      payload: true
    });
  });
});
