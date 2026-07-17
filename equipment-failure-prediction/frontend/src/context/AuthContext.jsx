import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('auth_data');
    if (authData) {
      try {
        setUser(JSON.parse(authData));
      } catch (e) {
        localStorage.removeItem('auth_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        const userData = response.data; // AuthResponse: { token, userId, fullName, email, role }
        localStorage.setItem('auth_data', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid credentials or connection error';
      return { success: false, message };
    }
  };

  const register = async (fullName, email, password, role) => {
    try {
      const response = await authService.register(fullName, email, password, role);
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Email might be already in use.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_data');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user?.token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
