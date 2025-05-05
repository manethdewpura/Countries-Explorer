import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { setFavorites } from "../store/favoritesSlice.store";
import CountryCard from "../components/CountryCard";
import SearchFilter from "../components/SearchFilter";
import HamburgerMenu from "../components/HamburgerMenu";
import { filterCountries, fetchCountries } from "../services/countries.service";
import { getUniqueRegionsAndLanguages, sortCountries } from "../utils/filters.util";
import ThemeToggle from "../components/ThemeToggle";
import CompareCountries from "../components/CompareCountries";
import ComparisonButton from "../components/ComparisonButton";

/**
 * Minimum time in milliseconds to show loading state for better UX
 */
const MINIMUM_LOADING_TIME = 800;

/**
 * Home component - Main page displaying all countries with search and filter functionality
 * Manages country data fetching, filtering, and real-time favorites sync
 */
export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableOptions, setAvailableOptions] = useState({
    regions: [],
    languages: [],
  });
  const { searchQuery, selectedLanguages, selectedRegions, sortBy } =
    useSelector((state) => state.session);

  /**
   * Initialize filter options by fetching all countries and extracting unique regions/languages
   */
  useEffect(() => {
    const initializeOptions = async () => {
      setIsLoading(true);
      try {
        const allCountries = await fetchCountries();
        const options = getUniqueRegionsAndLanguages(allCountries);
        setAvailableOptions(options);
      } catch (error) {
        console.error("Failed to load filter options:", error);
      }
    };

    initializeOptions();
  }, []);

  /**
   * Set up real-time listener for user favorites from Firestore
   */
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "favorites"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const favoritesData = snapshot.docs.map((doc) => ({
          countryCode: doc.data().countryCode,
          favoriteId: doc.id,
        }));
        dispatch(setFavorites(favoritesData));
      },
      (error) => {
        console.error("Error fetching favorites:", error);
      }
    );

    return () => unsubscribe();
  }, [user, dispatch]);

  /**
   * Handles data loading with debouncing and minimum loading time
   * Applies filters and sorting to countries data
   */
  const loadData = useCallback(async () => {
    setError(null);
    setCountries([]);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 50));

      const loadingDelay = new Promise((resolve) =>
        setTimeout(resolve, MINIMUM_LOADING_TIME)
      );
      const dataPromise = filterCountries(
        searchQuery,
        selectedRegions,
        selectedLanguages
      );

      const [data] = await Promise.all([dataPromise, loadingDelay]);
      const sortedData = sortCountries(data, sortBy);

      if (sortedData.length === 0) {
        setError(
          "No countries found matching your criteria. Try adjusting your filters."
        );
      } else {
        setCountries(sortedData);
      }
    } catch (error) {
      setError(
        error.message || "Failed to load countries. Please try again later."
      );
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedRegions, selectedLanguages, sortBy]);

  useEffect(() => {
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, [loadData]);

  return (
    <div className="min-h-screen dark:bg-gray-800 dark:text-white">
      <div className="container max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <HamburgerMenu />
            <h1 className="text-2xl font-bold">Countries Explorer</h1>
          </div>
          <ThemeToggle />
        </div>
        <SearchFilter
          availableRegions={availableOptions.regions}
          availableLanguages={availableOptions.languages}
          isLoading={isLoading}
        />

        <div className="relative min-h-[200px]">
          {isLoading && (
            <div 
              data-testid="loading-spinner"
              className="absolute inset-0 flex justify-center items-center"
            >
              <div 
                className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"
                role="status"
                aria-label="Loading countries"
              />
            </div>
          )}

          {!isLoading && (
            <>
              {error && (
                <div className="text-center my-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fadeIn border border-gray-200 dark:border-gray-600">
                  <div className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2">
                    Sorry
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {error}
                  </div>
                </div>
              )}

              {countries.length > 0 && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-8">
                  {countries.map((country, index) => (
                    <div
                      key={country.cca3}
                      className="opacity-0"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${
                          index * 0.05
                        }s forwards`,
                      }}
                    >
                      <CountryCard country={country} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ComparisonButton />
      <CompareCountries />
    </div>
  );
}
