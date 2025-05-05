import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { setFavorites, setLoading, setError } from "../store/favoritesSlice.store";
import { getCountryDetails } from "../services/countries.service";
import CountryCard from "../components/CountryCard";
import HamburgerMenu from "../components/HamburgerMenu";
import ThemeToggle from "../components/ThemeToggle";
import ComparisonButton from "../components/ComparisonButton";
import CompareCountries from "../components/CompareCountries";

/**
 * Favorites component that displays user's favorite countries
 * Manages fetching and displaying favorite countries from Firestore
 */
export default function Favorites() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.favorites);
  // State to store fetched country details
  const [countries, setCountries] = useState([]);
  // State to track when country details are being fetched
  const [fetchingDetails, setFetchingDetails] = useState(false);

  /**
   * Effect hook to fetch and sync favorites with Firestore
   * Sets up a real-time listener for favorites collection changes
   * Fetches detailed country information for each favorite
   */
  useEffect(() => {
    if (!user) return;

    dispatch(setLoading(true));
    const q = query(collection(db, "users", user.uid, "favorites"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const favoritesData = snapshot.docs.map((doc) => ({
          countryCode: doc.data().countryCode,
          favoriteId: doc.id,
        }));
        dispatch(setFavorites(favoritesData));

        setFetchingDetails(true);
        try {
          const countryPromises = favoritesData.map(async (fav) => {
            const countryData = await getCountryDetails(fav.countryCode);
            return { ...countryData, favoriteId: fav.favoriteId };
          });
          const countryDetails = await Promise.all(countryPromises);
          setCountries(countryDetails);
        } catch (error) {
          console.error("Error fetching country details:", error);
          dispatch(setError("Failed to load country details"));
        }
        setFetchingDetails(false);
      },
      (error) => {
        console.error("Error fetching favorites:", error);
        dispatch(setError("Failed to load favorites"));
      }
    );

    return () => unsubscribe();
  }, [user, dispatch]);

  if (loading || fetchingDetails) {
    return (
      <div className="min-h-screen dark:bg-gray-800 dark:text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-800 dark:text-white">
      <div className="container max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <HamburgerMenu />
            <h1 className="text-2xl font-bold">My Favorites</h1>
          </div>
          <ThemeToggle />
        </div>

        {countries.length === 0 ? (
          <div className="text-center my-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fadeIn">
            <p className="text-gray-600 dark:text-gray-300">
              You haven't added any countries to your favorites yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {countries.map((country, index) => (
              <div
                key={country.cca3}
                className="opacity-0"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s forwards`,
                }}
              >
                <CountryCard country={country} />
              </div>
            ))}
          </div>
        )}
      </div>
      <ComparisonButton />
      <CompareCountries />
    </div>
  );
}
