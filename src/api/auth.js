import axiosInstance from 'src/utils/axios';

export const confirmEmail = async (hash) =>
  axiosInstance.post('/api/v1/auth/email/confirm', { hash });

export const resetPassword = async (data) =>
  axiosInstance.post('/api/v1/auth/reset/password', data);
