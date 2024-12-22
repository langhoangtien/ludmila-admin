import { generateCustomers } from 'src/utils/common';
import axiosInstance, { encodeData } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const getCustomers = async () => axiosInstance.get('/api/v1/customers');

export const getCustomer = async (customerId) =>
  axiosInstance.get(`/api/v1/customers/${customerId}`);

export const addCustomer = async (customerData) =>
  axiosInstance.post('/api/v1/customers', customerData);

export const updateCustomer = async (customerId, updatedCustomerData) =>
  axiosInstance.patch(`/api/v1/customers/${customerId}`, updatedCustomerData);

export const deleteCustomer = async (customerId) =>
  axiosInstance.delete(`/api/v1/customers/${customerId}`);

export const deleteCustomers = async (customerIds) =>
  axiosInstance.delete(`/api/v1/customers/remove-many?ids=${encodeData(customerIds)}`);

export const generateCustomerAPI = async () => {
  const customers = generateCustomers(10000);
  const customerPromises = customers.map((customer) => addCustomer(customer));
  await Promise.all(customerPromises);
};
