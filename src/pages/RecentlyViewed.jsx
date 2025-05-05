import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { setFavorites } from "../store/favoritesSlice.store";
import CountryCard from "../components/CountryCard";
import HamburgerMenu from "../components/HamburgerMenu";
import ThemeToggle from "../components/ThemeToggle";
import { clearRecentlyViewed } from "../store/recentlyViewedSlice.store";
import ComparisonButton from "../components/ComparisonButton";
import CompareCountries from "../components/CompareCountries";

/**
 * RecentlyViewed component - Displays user's recently viewed countries
 * Maintains real-time sync with favorites and displays country history
 */
export default function RecentlyViewed() {
  const { countries } = useSelector((state) => state.recentlyViewed);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * Set up real-time listener for user favorites
   * Updates favorites state in Redux store
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

  return (
    <div className="min-h-screen dark:bg-gray-800 dark:text-white">
      <div className="container max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <HamburgerMenu />
            <h1 className="text-2xl font-bold">Recently Viewed</h1>
          </div>
          <ThemeToggle />
        </div>

        {countries.length === 0 ? (
          <div className="text-center my-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fadeIn">
            <p className="text-gray-600 dark:text-gray-300">
              You haven't viewed any countries yet.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => dispatch(clearRecentlyViewed())}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Clear History
              </button>
            </div>
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
          </>
        )}
        <ComparisonButton />
        <CompareCountries />
      </div>
    </div>
  );
}
