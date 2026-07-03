import axios from 'axios';

export const getProducts = async (filters = {}) => {
  const response = await axios.get('/api/products', { params: filters });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await axios.get(`/api/products/${id}`);
  return response.data;
};

export const addReview = async (id, review) => {
  const response = await axios.post(`/api/products/${id}/reviews`, review);
  return response.data;
};
