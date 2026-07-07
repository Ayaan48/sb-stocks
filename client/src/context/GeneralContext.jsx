import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sbstocks_token');
    if (token) {
      axiosInstance.get('/users/profile')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('sbstocks_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('sbstocks_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sbstocks_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await axiosInstance.get('/users/profile');
      setUser(res.data);
    } catch {}
  };

  return (
    <GeneralContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);
export default GeneralContext;
