import axios from 'axios';

export const loginUser = async (email, password) => {
  const response = await axios.post('/api/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post('/api/auth/register', userData);
  return response.data;
};

export const fetchProfile = async (token) => {
  const response = await axios.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (profileData, token) => {
  const response = await axios.put('/api/auth/profile', profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
