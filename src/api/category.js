import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints, encodeData } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCategories() {
  const URL = endpoints.category.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      categories: data?.items || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.items.length,
    }),
    [data?.items, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCategory(categoryId) {
  const URL = categoryId ? [endpoints.category.details, { params: { categoryId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      category: data?.category,
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
    }),
    [data?.category, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchCategories(query) {
  const URL = query ? [endpoints.category.search, { params: { query } }] : '';

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
export const getCategories = async () => axiosInstance.get('/api/v1/categories?limit=500');

export const getCategory = async (categoryId) =>
  axiosInstance.get(`/api/v1/categories/${categoryId}`);
// Functions for category operations
export const addCategory = async (categoryData) =>
  axiosInstance.post('/api/v1/categories', categoryData);

export const updateCategory = async (categoryId, updatedCategoryData) =>
  axiosInstance.patch(`/api/v1/categories/${categoryId}`, updatedCategoryData);

export const deleteCategory = async (categoryId) =>
  axiosInstance.delete(`/api/v1/categories/${categoryId}`);

export const deleteCategories = async (categoryIds) =>
  axiosInstance.delete(`/api/v1/categories/remove-many?ids=${encodeData(categoryIds)}`);
