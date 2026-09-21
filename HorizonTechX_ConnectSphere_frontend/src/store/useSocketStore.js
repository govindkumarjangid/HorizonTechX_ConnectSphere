import { create } from 'zustand';
import { io } from 'socket.io-client';
import useToastStore from './useToastStore';
import usePostStore from './usePostStore';
import useCommentStore from './useCommentStore';
import useUserStore from './useUserStore';

let socketInstance = null;

export const useSocketStore = create((set, get) => ({
  socket: null,
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  connect: (token) => {
    if (!token) {
      get().disconnect();
      return;
    }

    if (socketInstance && socketInstance.connected) {
      return;
    }

    if (socketInstance) {
      socketInstance.disconnect();
    }

    const socketUrl =
      import.meta.env?.VITE_SOCKET_URL ||
      import.meta.env?.VITE_API_URL?.replace(/\/api\/?$/, '') ||
      'http://localhost:5000';

    socketInstance = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      set({ socket: socketInstance, isConnected: true });
    });

    socketInstance.on('disconnect', () => {
      set({ isConnected: false });
    });

    // Real-time Notifications
    socketInstance.on('notification:new', (payload) => {
      set((state) => ({
        notifications: [payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));

      // Trigger global toast
      useToastStore.getState().notification(payload);
    });

    // Real-time Post updates
    socketInstance.on('post:new', (post) => {
      usePostStore.getState().handleSocketNewPost(post);
    });

    socketInstance.on('post:updated', (post) => {
      usePostStore.getState().handleSocketUpdatePost(post);
      useUserStore.getState().handleSocketUpdatePost(post);
    });

    socketInstance.on('post:deleted', ({ postId }) => {
      usePostStore.getState().handleSocketDeletePost(postId);
      useUserStore.getState().handleSocketDeletePost(postId);
    });

    socketInstance.on('post:like_updated', ({ postId, likesCount }) => {
      usePostStore.getState().handleSocketLikeUpdate(postId, likesCount);
      useUserStore.getState().handleSocketLikeUpdate(postId, likesCount);
    });

    // Real-time Comment updates
    socketInstance.on('comment:new', ({ postId, comment, commentsCount }) => {
      useCommentStore.getState().handleSocketNewComment(postId, comment);
      usePostStore.getState().handleSocketCommentCount(postId, commentsCount);
      useUserStore.getState().handleSocketCommentCount(postId, commentsCount);
    });

    socketInstance.on('comment:deleted', ({ postId, commentId, commentsCount }) => {
      useCommentStore.getState().handleSocketDeleteComment(postId, commentId);
      usePostStore.getState().handleSocketCommentCount(postId, commentsCount);
      useUserStore.getState().handleSocketCommentCount(postId, commentsCount);
    });

    // Real-time Follow updates
    socketInstance.on('user:follow_updated', (data) => {
      useUserStore.getState().handleSocketFollowUpdate(data);
    });

    // Real-time Profile updates
    socketInstance.on('user:profile_updated', (updatedUser) => {
      useUserStore.getState().handleSocketProfileUpdate(updatedUser);
      usePostStore.getState().handleSocketAuthorUpdate(updatedUser);
    });
  },

  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
    set({
      socket: null,
      notifications: [],
      unreadCount: 0,
      isConnected: false,
    });
  },

  clearUnread: () => set({ unreadCount: 0 }),
}));

export default useSocketStore;
