import { create } from 'zustand';
import authApi from '../api/authApi';
import useToastStore from './useToastStore';

export const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem('cs_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('token') || localStorage.getItem('cs_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('token') || localStorage.getItem('cs_token')),
  isLoading: true,
  isSubmitting: false,

  checkAuth: async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('cs_token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const apiFn = authApi.getMe || authApi.getCurrentUser;
      const res = await apiFn();
      const userData = res.data?.data || res.data;
      if (userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('cs_token', token);
        localStorage.setItem('cs_user', JSON.stringify(userData));
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('No user data returned');
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('cs_token');
      localStorage.removeItem('cs_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials) => {
    try {
      set({ isSubmitting: true });
      const res = await authApi.login(credentials);
      const data = res.data?.data || res.data;

      if (!data?.token || !data?.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('cs_token', data.token);
      localStorage.setItem('cs_user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        isSubmitting: false,
      });

      useToastStore.getState().success(`Welcome back, ${data.user.fullName || data.user.username}!`);
      return { success: true, user: data.user };
    } catch (err) {
      set({ isSubmitting: false });
      const message = err.response?.data?.message || err.message || 'Login failed';
      useToastStore.getState().error(message);
      return { success: false, error: message };
    }
  },

  register: async (userData) => {
    try {
      set({ isSubmitting: true });
      const res = await authApi.register(userData);
      const data = res.data?.data || res.data;

      if (!data?.token || !data?.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('cs_token', data.token);
      localStorage.setItem('cs_user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        isSubmitting: false,
      });

      useToastStore.getState().success('Account created successfully! Welcome to ConnectSphere.');
      return { success: true, user: data.user };
    } catch (err) {
      set({ isSubmitting: false });
      const message = err.response?.data?.message || err.message || 'Registration failed';
      useToastStore.getState().error(message);
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await authApi.logout().catch(() => {});
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('cs_token');
      localStorage.removeItem('cs_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isSubmitting: false,
      });
      useToastStore.getState().info('You have been logged out');
    }
  },

  updateUser: (updatedFields) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    localStorage.setItem('cs_user', JSON.stringify(updated));
    set({ user: updated });
  },
}));

export default useAuthStore;