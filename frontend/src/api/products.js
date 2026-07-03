import api from './client.js';

export const getProducts = async (filters = {}) => {
  const response = await api.get('/api/products', { params: filters });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const addReview = async (id, review) => {
  const response = await api.post(`/api/products/${id}/reviews`, review);
  return response.data;
};
