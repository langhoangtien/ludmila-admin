import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints, encodeData } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetUsers() {
  const URL = endpoints.user.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data?.items || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.items.length,
    }),
    [data?.items, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetUser(userId) {
  const URL = userId ? [endpoints.user.details, { params: { userId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      user: data?.user,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
    }),
    [data?.user, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchUsers(query) {
  const URL = query ? [endpoints.user.search, { params: { query } }] : '';

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
export const getUsers = async () => axiosInstance.get('/api/v1/users');
// Hàm gửi request sửa thông tin sản phẩm
export const getUser = async (userId) => axiosInstance.get(`/api/v1/users/${userId}`);

// Hàm gửi request thêm sản phẩm
export const addUser = async (userData) => axiosInstance.post('/api/v1/users', userData);

// Hàm gửi request sửa thông tin sản phẩm
export const updateUser = async (userId, updatedUserData) =>
  axiosInstance.patch(`/api/v1/users/${userId}`, updatedUserData);

// Hàm gửi request xóa sản phẩm
export const deleteUser = async (userId) => axiosInstance.delete(`/api/v1/users/${userId}`);

// Hàm gửi request xóa sản phẩm
export const deleteUsers = async (userIds) =>
  axiosInstance.delete(`/api/v1/users/remove-many?ids=${encodeData(userIds)}`);
