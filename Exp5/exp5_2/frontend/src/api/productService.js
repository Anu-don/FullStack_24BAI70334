import axios from 'axios';

// Base URL of the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api/products';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Every backend response is wrapped as { success, message, data, timestamp, correlationId }
// and also echoes the correlation ID as a response header (X-Correlation-Id).
// These helpers unwrap the body but keep the correlation ID available to the caller
// so the UI can display it - useful for tracing a specific request in backend logs.

const extractCorrelationId = (response) =>
  response.headers['x-correlation-id'] || response.data?.correlationId || null;

export const getAllProducts = async () => {
  const response = await api.get('');
  return {
    products: response.data.data,
    correlationId: extractCorrelationId(response),
  };
};

export const createProduct = async (product) => {
  const response = await api.post('', product);
  return { ...response.data, correlationId: extractCorrelationId(response) };
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/${id}`, product);
  return { ...response.data, correlationId: extractCorrelationId(response) };
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/${id}`);
  return { ...response.data, correlationId: extractCorrelationId(response) };
};
