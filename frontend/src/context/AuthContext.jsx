import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, fetchProfile, updateProfile } from '../api/auth.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('artisanToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('artisanToken', token);
      fetchProfile(token)
        .then((profile) => setUser(profile))
        .catch(() => setToken(null))
        .finally(() => setLoading(false));
    } else {
      localStorage.removeItem('artisanToken');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const data = await registerUser(formData);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const updateUserProfile = async (updated) => {
    const data = await updateProfile(updated, token);
    setUser(data);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
