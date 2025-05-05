/* eslint-disable no-undef */
import themeReducer, { setDarkMode, setUseSystemTheme } from '../../store/themeSlice.store';

describe('theme slice', () => {
  const initialState = {
    darkMode: false,
    useSystemTheme: true,
  };

  it('should handle initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setDarkMode', () => {
    const actual = themeReducer(initialState, setDarkMode(true));
    expect(actual.darkMode).toBe(true);
    expect(actual.useSystemTheme).toBe(false);
  });

  it('should handle setUseSystemTheme', () => {
    const mockMatchMedia = jest.fn(() => ({
      matches: true
    }));
    window.matchMedia = mockMatchMedia;

    const actual = themeReducer(
      { darkMode: false, useSystemTheme: false },
      setUseSystemTheme()
    );
    
    expect(actual.useSystemTheme).toBe(true);
    expect(actual.darkMode).toBe(true);
  });
});
