import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ type = 'info', message = '', title = '', fromUser = null, duration = 4000 }) => {
    const existing = get().toasts;
    if (existing.some((t) => t.message === message && t.type === type)) {
      return null;
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newToast = { id, type, message, title, fromUser, duration };

    set((state) => ({
      toasts: [...state.toasts.slice(-4), newToast], // Keep max 5 visible
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  success: (message, title = '') => {
    return get().addToast({ type: 'success', message, title });
  },

  error: (message, title = '') => {
    return get().addToast({ type: 'error', message: message || 'Something went wrong', title });
  },

  info: (message, title = '') => {
    return get().addToast({ type: 'info', message, title });
  },

  notification: (notif) => {
    return get().addToast({
      type: 'notification',
      title: notif.type,
      fromUser: notif.fromUser,
      message: notif.message,
      duration: 5000,
    });
  },

  clearAll: () => set({ toasts: [] }),
}));

export default useToastStore;
