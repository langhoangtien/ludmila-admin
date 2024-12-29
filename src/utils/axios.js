import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });
export const encodeData = (data) => encodeURIComponent(JSON.stringify(data));

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  file: '/api/v1/files',
  chat: '/api/v1/chat',
  kanban: '/api/v1/kanban',
  calendar: '/calendar',
  auth: {
    me: '/api/v1/auth/me',
    login: '/api/v1/auth/email/login',
    register: '/api/v1/auth/email/register',
  },
  mail: {
    list: '/api/v1/mail/list',
    details: '/api/v1/mail/details',
    labels: '/api/v1/mail/labels',
  },
  post: {
    list: '/api/v1/post/list',
    details: '/api/v1/post/details',
    latest: '/api/v1/post/latest',
    search: '/api/v1/post/search',
  },
  product: {
    list: '/api/v1/products',
    details: '/api/v1/products/663f3067cc624fb4df7fc6bf',
    search: '/api/v1/products/s',
    removeMany: '/api/v1/products/remove-many',
  },
  page: {
    list: '/api/v1/pages',
    search: '/api/v1/pages/s',
    removeMany: '/api/v1/pages/remove-many',
  },
  user: {
    list: '/api/v1/users',
    details: '/api/v1/users/663f3067cc624fb4df7fc6bf',
    search: '/api/v1/users/s',
    removeMany: '/api/v1/users/remove-many',
  },
  category: {
    list: '/api/v1/categories',
    details: '/api/v1/categories/663f3067cc624fb4df7fc6bf',
    search: '/api/v1/categories/s',
    removeMany: '/api/v1/categories/remove-many',
  },
  country: {
    list: '/api/v1/countries',
    details: '/api/v1/countries/663f3067cc624fb4df7fc6bf',
    search: '/api/v1/countries/s',
    removeMany: '/api/v1/countries/remove-many',
  },
  order: {
    list: '/api/v1/orders',
    removeMany: '/api/v1/countries/remove-many',
  },
  brand: {
    list: '/api/v1/brands',
    details: '/api/v1/brands/663f3067cc624fb4df7fc6bf',
    search: '/api/v1/brands/s',
    removeMany: '/api/v1/brands/remove-many',
  },
  customer: {
    list: '/api/v1/customers',
    search: '/api/v1/customers/s',
    removeMany: '/api/v1/customers/remove-many',
  },
  invoice: {
    list: '/api/v1/invoices',
    details: '/api/v1/invoices/663f3067cc624fb4df7fc6bf',
    search: '/api/v1/invoices/s',
    removeMany: '/api/v1/invoices/remove-many',
  },
};
