/* eslint-disable no-undef */
import axios from 'axios';
import { fetchCountries, searchCountries, filterCountries } from '../../services/countries.service';

jest.mock('axios');

describe('Countries API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCountries', () => {
    it('fetches all countries successfully', async () => {
      const mockData = [{ name: { common: 'Brazil' } }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchCountries();
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
    });
  });

  describe('searchCountries', () => {
    it('searches countries by name', async () => {
      const mockData = [{ name: { common: 'Brazil' } }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await searchCountries('brazil');
      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/brazil');
    });
  });

  describe('filterCountries', () => {
    it('handles search with multiple filters', async () => {
      const mockData = [
        { 
          name: { common: 'Brazil' },
          region: 'Americas',
          languages: { por: 'Portuguese' }
        }
      ];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await filterCountries('brazil', ['Americas'], ['Portuguese']);
      expect(result).toEqual(mockData);
    });

    it('handles API errors gracefully', async () => {
      axios.get.mockRejectedValueOnce({ response: { status: 404 } });

      await expect(filterCountries('nonexistent')).rejects.toThrow(
        'We couldn\'t find any countries matching your search'
      );
    });
  });
});
