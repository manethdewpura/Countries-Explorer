import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDarkMode, setUseSystemTheme } from "../store/themeSlice.store";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

/**
 * ThemeToggle component - Manages theme switching functionality
 * Handles system theme detection and user theme preferences
 */
export default function ThemeToggle() {
  const dispatch = useDispatch();
  const { darkMode, useSystemTheme } = useSelector((state) => state.theme);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  /**
   * Effect to handle system theme changes
   * Sets up listener for system theme preference changes
   */
  useEffect(() => {
    if (!useSystemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      dispatch(setDarkMode(e.matches));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [useSystemTheme, dispatch]);

  /**
   * Effect to handle clicks outside the theme menu
   * Closes the menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 
        dark:hover:bg-gray-600 transition-colors shadow-md border border-gray-200 
        dark:border-gray-600"
        aria-label="Theme settings"
      >
        {useSystemTheme ? (
          <FaDesktop className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        ) : darkMode ? (
          <FaMoon className="w-6 h-6 text-indigo-500 dark:text-indigo-300" />
        ) : (
          <FaSun className="w-6 h-6 text-amber-500" />
        )}
      </button>

      {showMenu && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white 
        dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50 border border-gray-200 
        dark:border-gray-600"
        >
          <div className="py-1" role="menu">
            <button
              onClick={() => {
                dispatch(setDarkMode(false));
                setShowMenu(false);
              }}
              className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-100 
              dark:hover:bg-gray-600 flex items-center gap-3
                ${
                  !darkMode && !useSystemTheme
                    ? "bg-blue-50 dark:bg-blue-900/50"
                    : ""
                }`}
              role="menuitem"
            >
              <FaSun className="w-5 h-5 text-amber-500" />
              <span className="font-medium">Light Mode</span>
            </button>
            <button
              onClick={() => {
                dispatch(setDarkMode(true));
                setShowMenu(false);
              }}
              className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-100 
              dark:hover:bg-gray-600 flex items-center gap-3
                ${
                  darkMode && !useSystemTheme
                    ? "bg-blue-50 dark:bg-blue-900/50"
                    : ""
                }`}
              role="menuitem"
            >
              <FaMoon className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />
              <span className="font-medium">Dark Mode</span>
            </button>
            <button
              onClick={() => {
                dispatch(setUseSystemTheme());
                setShowMenu(false);
              }}
              className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-100 
              dark:hover:bg-gray-600 flex items-center gap-3
                ${useSystemTheme ? "bg-blue-50 dark:bg-blue-900/50" : ""}`}
              role="menuitem"
            >
              <FaDesktop className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              <span className="font-medium">System</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
