import axios from 'axios';

export const getArtisans = async () => {
  const response = await axios.get('/api/artisans');
  return response.data;
};

export const getArtisan = async (id) => {
  const response = await axios.get(`/api/artisans/${id}`);
  return response.data;
};

export const getArtisanProducts = async (id) => {
  const response = await axios.get(`/api/artisans/${id}/products`);
  return response.data;
};
