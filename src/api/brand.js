import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints, encodeData } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBrands() {
  const URL = endpoints.brand.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      brands: data?.items || [],
      brandsLoading: isLoading,
      brandsError: error,
      brandsValidating: isValidating,
      brandsEmpty: !isLoading && !data?.items.length,
    }),
    [data?.items, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBrand(brandId) {
  const URL = brandId ? [endpoints.brand.details, { params: { brandId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      brand: data?.brand,
      brandLoading: isLoading,
      brandError: error,
      brandValidating: isValidating,
    }),
    [data?.brand, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchBrands(query) {
  const URL = query ? [endpoints.brand.search, { params: { query } }] : '';

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
export const getBrands = async () => axiosInstance.get('/api/v1/brands?limit=500');

export const getBrand = async (brandId) => axiosInstance.get(`/api/v1/brands/${brandId}`);
// Functions for brand operations
export const addBrand = async (brandData) => axiosInstance.post('/api/v1/brands', brandData);

export const updateBrand = async (brandId, updatedBrandData) =>
  axiosInstance.patch(`/api/v1/brands/${brandId}`, updatedBrandData);

export const deleteBrand = async (brandId) => axiosInstance.delete(`/api/v1/brands/${brandId}`);

export const deleteBrands = async (brandIds) =>
  axiosInstance.delete(`/api/v1/brands/remove-many?ids=${encodeData(brandIds)}`);
