import axios from 'axios'
import { sortCountries } from '../utils/filters.util'

// API base URL
const API_BASE = 'https://restcountries.com/v3.1'

// Get all countries
export const fetchCountries = async () => {
  const { data } = await axios.get(`${API_BASE}/all`)
  return data
}

// Search countries by name
export const searchCountries = async (name) => {
  const { data } = await axios.get(`${API_BASE}/name/${name}`)
  return data
}

// Get details for a specific country
export const getCountryDetails = async (code) => {
  const { data } = await axios.get(`${API_BASE}/alpha/${code}`)
  return data[0]
}

// Filter countries by search query, regions and languages
export const filterCountries = async (searchQuery = '', regions = [], languages = []) => {
  try {
    let endpoint = `${API_BASE}`;
    
    if (searchQuery) {
      endpoint += `/name/${searchQuery}`;
    } else if (regions.length === 1) {
      endpoint += `/region/${regions[0].toLowerCase()}`;
    } else {
      endpoint += '/all';
    }
    
    const { data } = await axios.get(endpoint);
    
    let filteredData = data;
    
    if (regions.length > 1) {
      filteredData = filteredData.filter(country => 
        regions.includes(country.region)
      );
    }
    
    if (languages.length > 0) {
      filteredData = filteredData.filter(country =>
        country.languages &&
        Object.values(country.languages).some(lang =>
          languages.some(selectedLang =>
            lang.toLowerCase() === selectedLang.toLowerCase()
          )
        )
      );
    }
    
    return sortCountries(filteredData);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('We couldn\'t find any countries matching your search. Try adjusting your search terms or filters.');
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    } else if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network.');
    } else {
      throw new Error('Failed to load countries. Please try again later.');
    }
  }
};
