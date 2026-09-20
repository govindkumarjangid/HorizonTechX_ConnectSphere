import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { currentUser as initialUser } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_user');
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      // ignore parse error
    }
    return initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const updateProfile = useCallback((updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('cs_user', JSON.stringify(next));
      } catch (_e) {
        // ignore storage error
      }
      return next;
    });
  }, []);

  const login = useCallback((userData) => {
    const newUser = userData || initialUser;
    setUser(newUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cs_user', JSON.stringify(newUser));
    } catch (_e) {
      // ignore storage error
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('cs_user');
    } catch (_e) {
      // ignore storage error
    }
  }, []);

  const contextValue = useMemo(
    () => ({ user, isAuthenticated, updateProfile, login, logout }),
    [user, isAuthenticated, updateProfile, login, logout]
  );

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;