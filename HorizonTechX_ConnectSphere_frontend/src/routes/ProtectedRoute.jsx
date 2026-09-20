import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/useAuthStore';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;