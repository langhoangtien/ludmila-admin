import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints, encodeData } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCountries() {
  const URL = endpoints.country.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      countries: data?.items || [],
      countriesLoading: isLoading,
      countriesError: error,
      countriesValidating: isValidating,
      countriesEmpty: !isLoading && !data?.items.length,
    }),
    [data?.items, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCountry(countryId) {
  const URL = countryId ? [endpoints.country.details, { params: { countryId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      country: data?.country,
      countryLoading: isLoading,
      countryError: error,
      countryValidating: isValidating,
    }),
    [data?.country, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchCountries(query) {
  const URL = query ? [endpoints.country.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export const getCountries = async () => axiosInstance.get('/api/v1/countries?limit=500');

export const getCountry = async (countryId) => axiosInstance.get(`/api/v1/countries/${countryId}`);
// Functions for country operations
export const addCountry = async (countryData) =>
  axiosInstance.post('/api/v1/countries', countryData);

export const updateCountry = async (countryId, updatedCountryData) =>
  axiosInstance.patch(`/api/v1/countries/${countryId}`, updatedCountryData);

export const deleteCountry = async (countryId) =>
  axiosInstance.delete(`/api/v1/countries/${countryId}`);

export const deleteCountries = async (countryIds) =>
  axiosInstance.delete(`/api/v1/countries/remove-many?ids=${encodeData(countryIds)}`);
