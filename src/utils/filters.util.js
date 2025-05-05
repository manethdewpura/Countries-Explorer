// Sort countries by different criteria
export const sortCountries = (countries, sortBy) => {
  const sortedCountries = [...countries];
  
  switch (sortBy) {
    case 'name':
      return sortedCountries.sort((a, b) => 
        a.name.common.localeCompare(b.name.common)
      );
    case 'nameDesc':
      return sortedCountries.sort((a, b) => 
        b.name.common.localeCompare(a.name.common)
      );
    case 'population':
      return sortedCountries.sort((a, b) => 
        a.population - b.population
      );
    case 'populationDesc':
      return sortedCountries.sort((a, b) => 
        b.population - a.population
      );
    default:
      return sortedCountries;
  }
};

// Extract unique regions and languages from countries data
export const getUniqueRegionsAndLanguages = (countries) => {
  const regions = new Set();
  const languages = new Set();

  countries.forEach(country => {
    if (country.region) regions.add(country.region);
    if (country.languages) {
      Object.values(country.languages).forEach(lang => languages.add(lang));
    }
  });

  return {
    regions: Array.from(regions).sort(),
    languages: Array.from(languages).sort()
  };
};
