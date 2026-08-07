import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      showToast(`Welcome back, ${data.name}!`);
      setLoading(false);
      return { success: true, role: data.role };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Login failed';
      showToast(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      showToast(`Account created successfully! Welcome, ${data.name}`);
      setLoading(false);
      return { success: true, role: data.role };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed';
      showToast(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    showToast('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        toastMessage,
        login,
        register,
        logout,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
