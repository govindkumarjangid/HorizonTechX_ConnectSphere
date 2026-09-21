import React, { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useSocketStore from '../store/useSocketStore';

export const AuthProvider = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(token);
    } else {
      disconnect();
    }
  }, [isAuthenticated, token, connect, disconnect]);

  return <>{children}</>;
};

export const useAuth = () => useAuthStore();
export default AuthProvider;
