import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints, encodeData } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.items || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.items.length,
    }),
    [data?.items, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

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

// Hàm gửi request thêm sản phẩm
export const getProducts = async () => axiosInstance.get('/api/v1/products');
// Hàm gửi request sửa thông tin sản phẩm
export const getProduct = async (productId) => axiosInstance.get(`/api/v1/products/${productId}`);

// Hàm gửi request thêm sản phẩm
export const addProduct = async (productData) =>
  axiosInstance.post('/api/v1/products', productData);

// Hàm gửi request sửa thông tin sản phẩm
export const updateProduct = async (productId, updatedProductData) =>
  axiosInstance.patch(`/api/v1/products/${productId}`, updatedProductData);

// Hàm gửi request xóa sản phẩm
export const deleteProduct = async (productId) =>
  axiosInstance.delete(`/api/v1/products/${productId}`);

// Hàm gửi request xóa sản phẩm
export const deleteProducts = async (productIds) =>
  axiosInstance.delete(`/api/v1/products/remove-many?ids=${encodeData(productIds)}`);
