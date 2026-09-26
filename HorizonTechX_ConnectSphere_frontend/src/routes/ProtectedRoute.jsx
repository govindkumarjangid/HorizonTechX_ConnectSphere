import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { LayoutSkeleton } from '../components/common/Loader';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading)
    return <LayoutSkeleton />;

  if (!isAuthenticated)
    return <Navigate to="/login" replace />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;