import api from './client.js';

export const getArtisans = async () => {
  const response = await api.get('/api/artisans');
  return response.data;
};

export const getArtisan = async (id) => {
  const response = await api.get(`/api/artisans/${id}`);
  return response.data;
};

export const getArtisanProducts = async (id) => {
  const response = await api.get(`/api/artisans/${id}/products`);
  return response.data;
};
