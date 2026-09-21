import { create } from 'zustand';
import commentApi from '../api/commentApi';
import usePostStore from './usePostStore';
import useToastStore from './useToastStore';

export const useCommentStore = create((set, get) => ({
  commentsByPost: {},
  loadingByPost: {},
  postingByPost: {},

  fetchComments: async (postId) => {
    if (!postId) return;
    if (get().loadingByPost[postId]) return;

    set((state) => ({
      loadingByPost: { ...state.loadingByPost, [postId]: true },
    }));

    try {
      const res = await commentApi.getComments(postId);
      const comments = res.data?.data?.items || res.data?.data || [];
      set((state) => ({
        commentsByPost: { ...state.commentsByPost, [postId]: comments },
        loadingByPost: { ...state.loadingByPost, [postId]: false },
      }));
    } catch (err) {
      set((state) => ({
        commentsByPost: { ...state.commentsByPost, [postId]: state.commentsByPost[postId] || [] },
        loadingByPost: { ...state.loadingByPost, [postId]: false },
      }));
      const msg = err.response?.data?.message || 'Failed to load comments';
      useToastStore.getState().error(msg);
    }
  },

  addComment: async (postId, text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      useToastStore.getState().error('Comment cannot be empty');
      return { success: false };
    }

    set((state) => ({
      postingByPost: { ...state.postingByPost, [postId]: true },
    }));

    try {
      const res = await commentApi.addComment(postId, { text: trimmed });
      const newComment = res.data?.data || res.data;

      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [...(state.commentsByPost[postId] || []), newComment],
        },
        postingByPost: { ...state.postingByPost, [postId]: false },
      }));

      usePostStore.getState().incrementCommentCount(postId);
      useToastStore.getState().success('Comment added');
      return { success: true, comment: newComment };
    } catch (err) {
      set((state) => ({
        postingByPost: { ...state.postingByPost, [postId]: false },
      }));
      const msg = err.response?.data?.message || 'Failed to post comment';
      useToastStore.getState().error(msg);
      return { success: false, error: msg };
    }
  },

  deleteComment: async (postId, commentId) => {
    const prevComments = get().commentsByPost[postId] || [];
    // Optimistic removal
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: prevComments.filter((c) => c._id !== commentId),
      },
    }));

    try {
      await commentApi.deleteComment(postId, commentId);
      usePostStore.getState().decrementCommentCount(postId);
      useToastStore.getState().success('Comment deleted');
      return { success: true };
    } catch (err) {
      // Revert on error
      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: prevComments,
        },
      }));
      const msg = err.response?.data?.message || 'Failed to delete comment';
      useToastStore.getState().error(msg);
      return { success: false, error: msg };
    }
  },

  // Socket real-time handlers
  handleSocketNewComment: (postId, comment) => {
    if (!postId || !comment?._id) return;
    set((state) => {
      const existing = state.commentsByPost[postId];
      if (!existing) return state;
      if (existing.some((c) => c._id === comment._id)) return state;
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [...existing, comment],
        },
      };
    });
  },

  handleSocketDeleteComment: (postId, commentId) => {
    if (!postId || !commentId) return;
    set((state) => {
      const existing = state.commentsByPost[postId];
      if (!existing) return state;
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: existing.filter((c) => c._id !== commentId),
        },
      };
    });
  },
}));

export default useCommentStore;
