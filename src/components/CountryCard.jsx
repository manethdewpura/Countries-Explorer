import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { setError } from "../store/favoritesSlice.store";
import { toggleCompare } from "../store/compareSlice.store";

/**
 * Card component displaying country information
 * Handles favoriting and comparison selection
 */
const CountryCard = ({ country }) => {
  const {
    flags,
    name,
    population,
    region,
    capital,
    languages,
    cca3,
  } = country;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { favoriteIds, items: favorites } = useSelector(state => state.favorites);
  const { countries: comparedCountries } = useSelector(state => state.compare);

  const isFavorite = favoriteIds?.includes(country.cca3);
  const isCompared = comparedCountries.some(c => c.cca3 === country.cca3);

  /**
   * Handles toggling favorite status
   * Manages Firestore document creation/deletion
   */
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        const favoriteDoc = favorites.find(fav => fav.countryCode === country.cca3);
        await deleteDoc(doc(db, 'users', user.uid, 'favorites', favoriteDoc.favoriteId));
      } else {
        await addDoc(collection(db, 'users', user.uid, 'favorites'), {
          countryCode: country.cca3,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      dispatch(setError('Failed to update favorites'));
    }
  };

  const languagesStr = languages ? Object.values(languages).join(", ") : "N/A";

  /**
   * Navigates to country details page
   */
  const handleClick = () => {
    navigate(`/country/${cca3}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer rounded-lg shadow-md hover:shadow-xl hover:scale-105 
      transition-transform bg-white dark:bg-gray-700 p-4 flex flex-col items-center gap-4"
      tabIndex={0}
      aria-label={`View details for ${name.common}`}
    >
      <div 
        className="absolute top-2 left-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleCompare(country));
        }}
      >
        <input
          type="checkbox"
          checked={isCompared}
          readOnly
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />
      </div>

      <button
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className={`absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 
        dark:hover:bg-gray-600 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
      >
        {isFavorite ? (
          <FaHeart className="text-red-500" size={20} />
        ) : (
          <FaRegHeart size={20} />
        )}
      </button>

      <img
        src={flags?.svg || flags?.png}
        alt={`Flag of ${name.common}`}
        className="w-32 h-20 object-cover rounded border"
        loading="lazy"
      />
      <div className="text-center">
        <h2 className="font-bold text-lg mb-1">{name.common}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Population:</span> {population.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Region:</span> {region}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Capital:</span> {capital ? capital.join(", ") : "N/A"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Languages:</span> {languagesStr}
        </p>
      </div>
    </div>
  );
};

export default CountryCard;
