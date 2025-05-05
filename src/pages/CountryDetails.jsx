import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { setFavorites } from "../store/favoritesSlice.store";
import { getCountryDetails } from "../services/countries.service";
import { addRecentlyViewed } from "../store/recentlyViewedSlice.store";

/**
 * CountryDetails component - Displays detailed information about a specific country
 * Handles favorite toggling and maintains real-time favorites sync
 */
export default function CountryDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { favoriteIds, items: favorites } = useSelector(
    (state) => state.favorites
  );

  const isFavorite = country ? favoriteIds.includes(country.cca3) : false;

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
        dispatch(setError("Failed to load favorites"));
      }
    );

    return () => unsubscribe();
  }, [user, dispatch]);

  /**
   * Toggles favorite status for the current country
   * Handles Firestore document creation and deletion
   */
  const toggleFavorite = async () => {
    if (!user || !country) return;

    try {
      if (isFavorite) {
        const favoriteDoc = favorites.find(
          (fav) => fav.countryCode === country.cca3
        );
        if (favoriteDoc) {
          await deleteDoc(
            doc(db, "users", user.uid, "favorites", favoriteDoc.favoriteId)
          );
        }
      } else {
        await addDoc(collection(db, "users", user.uid, "favorites"), {
          countryCode: country.cca3,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      dispatch(setError("Failed to update favorites"));
    }
  };

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        const data = await getCountryDetails(code);
        setCountry(data);
        dispatch(addRecentlyViewed(data));
      } catch (err) {
        setError("Failed to load country details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500 text-center my-8 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
            {error || "Country not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="container max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg 
            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-md flex items-center gap-2
            animate-[fadeIn_0.3s_ease-in]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <button
            onClick={toggleFavorite}
            className={`p-3 rounded-full transition-colors ${
              isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          >
            {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
          </button>
        </div>

        <div className="flex flex-col 2xl:grid 2xl:grid-cols-2 gap-8 2xl:gap-12 2xl:min-h-[800px] max-w-[2000px] mx-auto">
          <div className="flex flex-col gap-6 animate-[fadeIn_0.5s_ease-in]">
            <div className="w-full">
              <img
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              {country.flags.alt && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white">
                  {country.flags.alt}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg lg:flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Geography</h2>
              <div className="relative flex-1 min-h-[300px] lg:min-h-[400px]">
                <iframe
                  title="Country Map"
                  width="100%"
                  height="100%"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    country.latlng?.[1] - 5
                  }%2C${country.latlng?.[0] - 5}%2C${
                    country.latlng?.[1] + 5
                  }%2C${country.latlng?.[0] + 5}&layer=mapnik&marker=${
                    country.latlng?.[0]
                  }%2C${country.latlng?.[1]}&locale=en`}
                  className="rounded-lg absolute inset-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 animate-[fadeIn_0.7s_ease-in]">
            <div>
              <h1 className="text-4xl font-bold mb-2">{country.name.common}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-xl">
                {country.name.official}
              </p>
              {country.independent && (
                <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm">
                  Independent Nation
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <InfoItem
                  label="Capital"
                  value={country.capital?.join(", ") || "N/A"}
                />
                <InfoItem
                  label="Population"
                  value={country.population.toLocaleString()}
                />
                <InfoItem label="Region" value={country.region} />
                <InfoItem
                  label="Subregion"
                  value={country.subregion || "N/A"}
                />
                <InfoItem
                  label="Area"
                  value={`${country.area?.toLocaleString() || "N/A"} km²`}
                />
                <InfoItem
                  label="Start of Week"
                  value={
                    country.startOfWeek?.charAt(0).toUpperCase() +
                      country.startOfWeek?.slice(1) || "N/A"
                  }
                />
              </div>

              <div className="space-y-4">
                <InfoItem
                  label="Languages"
                  value={
                    country.languages
                      ? Object.values(country.languages).join(", ")
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Currencies"
                  value={
                    country.currencies
                      ? Object.values(country.currencies)
                          .map((curr) => `${curr.name} (${curr.symbol})`)
                          .join(", ")
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Time Zones"
                  value={country.timezones?.join(", ") || "N/A"}
                />
                <InfoItem
                  label="Driving Side"
                  value={
                    country.car?.side?.charAt(0).toUpperCase() +
                      country.car?.side?.slice(1) || "N/A"
                  }
                />
                <InfoItem
                  label="Car Signs"
                  value={country.car?.signs?.join(", ") || "N/A"}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Administrative Details
                </h2>
                <div className="space-y-4">
                  <InfoItem
                    label="UN Member"
                    value={country.unMember ? "Yes" : "No"}
                  />
                  <InfoItem label="FIFA Code" value={country.fifa || "N/A"} />
                  <InfoItem label="CIOC Code" value={country.cioc || "N/A"} />
                  <InfoItem
                    label="Alternative Spellings"
                    value={country.altSpellings?.join(", ") || "N/A"}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Geographical Features
                </h2>
                <div className="space-y-4">
                  <InfoItem
                    label="Continents"
                    value={country.continents?.join(", ") || "N/A"}
                  />
                  <InfoItem
                    label="Landlocked"
                    value={country.landlocked ? "Yes" : "No"}
                  />
                  <InfoItem
                    label="Coordinates"
                    value={
                      country.latlng
                        ? `${country.latlng[0]}°, ${country.latlng[1]}°`
                        : "N/A"
                    }
                  />
                  <InfoItem
                    label="Domain"
                    value={country.tld?.join(", ") || "N/A"}
                  />
                </div>
              </div>
            </div>

            {country.borders && country.borders.length > 0 && (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Border Countries</h2>
                <div className="flex flex-wrap gap-2">
                  {country.borders.map((border) => (
                    <button
                      key={border}
                      onClick={() => navigate(`/country/${border}`)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 
                      dark:hover:bg-gray-500 transition-colors"
                    >
                      {border}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg animate-[fadeIn_0.5s_ease-in]">
    <span className="font-semibold block text-sm text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </span>
    <span className="text-gray-900 dark:text-white">{value}</span>
  </div>
);
