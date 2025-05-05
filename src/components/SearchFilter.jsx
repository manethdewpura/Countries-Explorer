import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";

/**
 * SearchFilter component - Provides search and filtering functionality
 * Manages language search, region selection, and sorting options
 */
export default function SearchFilter({ availableRegions, availableLanguages }) {
  const {
    searchQuery,
    selectedLanguages = [],
    selectedRegions = [],
    sortBy = "name",
  } = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const [languageSearch, setLanguageSearch] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * Effect to handle clicks outside the language dropdown
   * Closes the dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Effect to handle language search state
   * Closes dropdown when search is empty
   */
  useEffect(() => {
    if (!languageSearch.trim()) {
      setShowLanguageDropdown(false);
    }
  }, [languageSearch]);

  const filteredLanguages = (availableLanguages || []).filter(
    (lang) =>
      lang.toLowerCase().includes(languageSearch.toLowerCase()) &&
      !selectedLanguages.includes(lang)
  );

  const regions = availableRegions || [];

  const handleLanguageSelect = (language) => {
    dispatch({ type: "session/addLanguageFilter", payload: language });
    setLanguageSearch("");
    setShowLanguageDropdown(false);
  };

  const handleRegionClick = (region) => {
    dispatch({ type: "session/addRegionFilter", payload: region });
  };

  const clearAllFilters = () => {
    dispatch({ type: "session/clearFilters" });
  };

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "nameDesc", label: "Name (Z-A)" },
    { value: "population", label: "Population (Low to High)" },
    { value: "populationDesc", label: "Population (High to Low)" },
  ];

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search, Language, and Sort inputs */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_2fr_auto_auto] transition-all duration-300">
        <div className="relative">
          <input
            type="text"
            placeholder="Search countries..."
            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg w-full 
            dark:bg-gray-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 
            dark:focus:ring-blue-400 focus:border-transparent outline-none"
            value={searchQuery}
            onChange={(e) =>
              dispatch({
                type: "session/setSearchQuery",
                payload: e.target.value,
              })
            }
          />
        </div>

        <div className="relative w-full" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search languages..."
            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg w-full 
            dark:bg-gray-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 
            dark:focus:ring-blue-400 focus:border-transparent outline-none"
            value={languageSearch}
            onChange={(e) => {
              setLanguageSearch(e.target.value);
              setShowLanguageDropdown(!!e.target.value.trim());
            }}
            onFocus={() => setShowLanguageDropdown(!!languageSearch.trim())}
          />

          {showLanguageDropdown && filteredLanguages.length > 0 && (
            <div
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 
            rounded-lg shadow-lg max-h-60 overflow-y-auto animate-slideDown [&::-webkit-scrollbar]:w-3 
            [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full 
            [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 dark:[&::-webkit-scrollbar-track]:bg-gray-800 
            dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-thumb:hover]:bg-gray-500"
            >
              {filteredLanguages.map((lang) => (
                <div
                  key={lang}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) =>
            dispatch({ type: "session/setSortBy", payload: e.target.value })
          }
          className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg w-full 
          dark:bg-gray-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 
          dark:focus:ring-blue-400 focus:border-transparent outline-none appearance-none
          pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
          bg-[length:12px_12px] bg-no-repeat bg-[right_1rem_center] md:col-span-1 min-w-[160px]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={clearAllFilters}
          className={`p-4 rounded-lg w-full md:w-40 transition-all duration-300 ${
            selectedLanguages.length > 0 || selectedRegions.length > 0
              ? "bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
          disabled={
            selectedLanguages.length === 0 && selectedRegions.length === 0
          }
        >
          Clear Filters
        </button>
      </div>
      {(selectedLanguages.length > 0 || selectedRegions.length > 0) && (
        <div className="flex flex-wrap gap-2 animate-fadeIn">
          {selectedLanguages.map((lang) => (
            <span
              key={lang}
              className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 
            px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
            >
              {lang}
              <button
                onClick={() =>
                  dispatch({
                    type: "session/removeLanguageFilter",
                    payload: lang,
                  })
                }
                className="text-sm hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          {selectedRegions.map((region) => (
            <span
              key={region}
              className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 
            dark:text-emerald-200 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
            >
              {region}
              <button
                onClick={() =>
                  dispatch({
                    type: "session/removeRegionFilter",
                    payload: region,
                  })
                }
                className="text-sm hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Region buttons */}
      <div className="flex flex-wrap gap-2 transition-all duration-300">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleRegionClick(region)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 shadow-sm ${
              selectedRegions.includes(region)
                ? "bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md"
                : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}
