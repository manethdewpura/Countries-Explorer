/* eslint-disable no-undef */
import { sortCountries, getUniqueRegionsAndLanguages } from '../../utils/filters.util';

describe('filters utils', () => {
  const mockCountries = [
    {
      name: { common: 'Brazil' },
      population: 1000000,
      region: 'Americas',
      languages: { por: 'Portuguese' }
    },
    {
      name: { common: 'Argentina' },
      population: 500000,
      region: 'Americas',
      languages: { spa: 'Spanish' }
    }
  ];

  describe('sortCountries', () => {
    it('should sort countries by name ascending', () => {
      const sorted = sortCountries(mockCountries, 'name');
      expect(sorted[0].name.common).toBe('Argentina');
      expect(sorted[1].name.common).toBe('Brazil');
    });

    it('should sort countries by name descending', () => {
      const sorted = sortCountries(mockCountries, 'nameDesc');
      expect(sorted[0].name.common).toBe('Brazil');
      expect(sorted[1].name.common).toBe('Argentina');
    });

    it('should sort countries by population ascending', () => {
      const sorted = sortCountries(mockCountries, 'population');
      expect(sorted[0].population).toBe(500000);
      expect(sorted[1].population).toBe(1000000);
    });

    it('should sort countries by population descending', () => {
      const sorted = sortCountries(mockCountries, 'populationDesc');
      expect(sorted[0].population).toBe(1000000);
      expect(sorted[1].population).toBe(500000);
    });
  });

  describe('getUniqueRegionsAndLanguages', () => {
    it('should return unique regions and languages', () => {
      const { regions, languages } = getUniqueRegionsAndLanguages(mockCountries);
      expect(regions).toEqual(['Americas']);
      expect(languages).toEqual(['Portuguese', 'Spanish']);
    });

    it('should handle empty countries array', () => {
      const { regions, languages } = getUniqueRegionsAndLanguages([]);
      expect(regions).toEqual([]);
      expect(languages).toEqual([]);
    });
  });
});
