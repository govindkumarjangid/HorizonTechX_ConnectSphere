import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { mockUsers } from '../utils/mockData';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_users');
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      // ignore parse error
    }
    return mockUsers;
  });

  const persistTimeoutRef = useRef(null);
  const scheduleSave = useCallback((newUsers) => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }
    persistTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('cs_users', JSON.stringify(newUsers));
      } catch (_e) {
        // ignore quota errors
      }
    }, 120);
  }, []);

  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    };
  }, []);

  const toggleFollow = useCallback((userId) => {
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          const isFollowing = !u.isFollowing;
          return {
            ...u,
            isFollowing,
            followersCount: isFollowing ? (u.followersCount || 0) + 1 : Math.max(0, (u.followersCount || 0) - 1),
          };
        }
        return u;
      });
      scheduleSave(updated);
      return updated;
    });
  }, [scheduleSave]);

  const getUserById = useCallback((id) => users.find((u) => u.id === id), [users]);
  const getUserByUsername = useCallback((username) => users.find((u) => u.username === username), [users]);

  const contextValue = useMemo(
    () => ({ users, toggleFollow, getUserById, getUserByUsername }),
    [users, toggleFollow, getUserById, getUserByUsername]
  );

  return React.createElement(
    UserContext.Provider,
    { value: contextValue },
    children
  );
};

export const useUserStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
};

export default useUserStore;