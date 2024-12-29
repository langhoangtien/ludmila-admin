import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints, encodeData } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetPages() {
  const URL = endpoints.page.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      pages: data?.items || [],
      pagesLoading: isLoading,
      pagesError: error,
      pagesValidating: isValidating,
      pagesEmpty: !isLoading && !data?.items.length,
    }),
    [data?.items, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPage(pageId) {
  const URL = pageId ? [endpoints.page.details, { params: { pageId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      page: data?.page,
      pageLoading: isLoading,
      pageError: error,
      pageValidating: isValidating,
    }),
    [data?.page, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchPages(query) {
  const URL = query ? [endpoints.page.search, { params: { query } }] : '';

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
export const getPages = async () => axiosInstance.get('/api/v1/pages?limit=500');

export const getPage = async (pageId) => axiosInstance.get(`/api/v1/pages/${pageId}`);
// Functions for page operations
export const addPage = async (pageData) => axiosInstance.post('/api/v1/pages', pageData);

export const updatePage = async (pageId, updatedPageData) =>
  axiosInstance.patch(`/api/v1/pages/${pageId}`, updatedPageData);

export const deletePage = async (pageId) => axiosInstance.delete(`/api/v1/pages/${pageId}`);

export const deletePages = async (pageIds) =>
  axiosInstance.delete(`/api/v1/pages/remove-many?ids=${encodeData(pageIds)}`);
