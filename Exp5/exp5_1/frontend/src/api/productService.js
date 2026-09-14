import axios from 'axios';

// Base URL of the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/products';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Every backend response is wrapped as { success, message, data, timestamp }
// These helpers unwrap it and return just the data (or throw with the message).

export const getAllProducts = async () => {
  const response = await api.get('');
  return response.data.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};

export const createProduct = async (product) => {
  const response = await api.post('', product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
