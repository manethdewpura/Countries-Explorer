/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import CountryCard from '../../components/CountryCard';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

describe('CountryCard', () => {
  const mockCountry = {
    cca3: 'BRA',
    flags: { svg: 'brazil-flag.svg', alt: 'Flag of Brazil' },
    name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
    population: 214000000,
    region: 'Americas',
    capital: ['Brasília'],
    languages: { por: 'Portuguese' }
  };

  const initialState = {
    auth: { user: null },
    favorites: { favoriteIds: [], items: [] },
    compare: { countries: [] }
  };

  let store;
  const navigate = jest.fn();

  beforeEach(() => {
    store = mockStore(initialState);
    useNavigate.mockReturnValue(navigate);
  });

  it('renders country information correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CountryCard country={mockCountry} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByText(/214,000,000/)).toBeInTheDocument();
    expect(screen.getByText(/Americas/)).toBeInTheDocument();
    expect(screen.getByText(/Brasília/)).toBeInTheDocument();
    expect(screen.getByText(/Portuguese/)).toBeInTheDocument();
  });

  it('handles favorite toggle for unauthenticated user', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CountryCard country={mockCountry} />
        </BrowserRouter>
      </Provider>
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('shows correct favorite state', () => {
    store = mockStore({
      ...initialState,
      favorites: { 
        favoriteIds: ['BRA'], 
        items: [{ countryCode: 'BRA' }] 
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <CountryCard country={mockCountry} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  it('handles comparison toggle', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CountryCard country={mockCountry} />
        </BrowserRouter>
      </Provider>
    );

    const compareCheckbox = screen.getByRole('checkbox');
    fireEvent.click(compareCheckbox);

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'compare/toggleCompare',
      payload: mockCountry
    });
  });
});
