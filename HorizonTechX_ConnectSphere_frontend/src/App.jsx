import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './store/useThemeStore';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Toast from './components/common/Toast';
import Loader, { LayoutSkeleton } from './components/common/Loader';
import Layout from './components/layout/Layout';

const Feed = lazy(() => import('./pages/Feed'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

import useAuthStore from './store/useAuthStore';

const RouteFallback = () => <LayoutSkeleton />;

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading)
    return <LayoutSkeleton />;

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Toast />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public Authentication Pages */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Protected App Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Feed />} />
                  <Route path="feed" element={<Navigate to="/" replace />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="profile/:username" element={<Profile />} />
                </Route>

                {/* 404 Catch-all */}
                <Route
                  path="*"
                  element={
                    <Layout hideSidebars>
                      <NotFound />
                    </Layout>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
