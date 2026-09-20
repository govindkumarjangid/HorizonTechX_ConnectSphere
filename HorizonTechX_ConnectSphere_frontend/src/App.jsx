import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './store/useThemeStore';
import { AuthProvider } from './store/useAuthStore';
import { UserProvider } from './store/useUserStore';
import { PostProvider } from './store/usePostStore';

import Layout from './components/layout/Layout';
import Feed from './pages/Feed';

// Code-split secondary routes for minimal initial bundle size & fast LCP
const Explore = lazy(() => import('./pages/Explore'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const Profile = lazy(() => import('./pages/Profile'));
const Connections = lazy(() => import('./pages/Connections'));
const Messages = lazy(() => import('./pages/Messages'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Communities = lazy(() => import('./pages/Communities'));
const SavedPosts = lazy(() => import('./pages/SavedPosts'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteFallback = () => (
  <div className="w-full min-h-[300px] flex items-center justify-center">
    <div className="w-7 h-7 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-500 animate-spin" />
  </div>
);

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <PostProvider>
            <BrowserRouter>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* Main App Layout */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Feed />} />
                    <Route path="feed" element={<Navigate to="/" replace />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/:username" element={<Profile />} />
                    <Route path="connections" element={<Connections />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="communities" element={<Communities />} />
                    <Route path="saved" element={<SavedPosts />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Authentication Pages */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* 404 Catch-all */}
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </PostProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
