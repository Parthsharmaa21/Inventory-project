import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage on initial load
    const storedUser = {
      id: localStorage.getItem('user_id'),
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role')
    };
    
    if (storedUser.id && storedUser.username) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user_id', userData.id);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('role', userData.role);
    setUser(userData);
    navigate('/home');
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};