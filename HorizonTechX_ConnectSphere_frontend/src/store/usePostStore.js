import { create } from 'zustand';
import postApi from '../api/postApi';
import useToastStore from './useToastStore';
import useUserStore from './useUserStore';

export const usePostStore = create((set, get) => ({
  posts: [],
  likingMap: {},
  isLoading: false,
  isLoadingMore: false,
  isCreating: false,
  isUpdating: false,
  hasMore: false,
  page: 1,
  error: null,

  fetchFeed: async (pageNum = 1) => {
    if (pageNum === 1) {
      set({ isLoading: true, error: null });
    } else {
      set({ isLoadingMore: true, error: null });
    }

    try {
      const res = await postApi.getFeed({ page: pageNum, limit: 10 });
      const data = res.data?.data;
      if (data) {
        set({
          posts: pageNum === 1 ? data.items || [] : [...get().posts, ...(data.items || [])],
          hasMore: Boolean(data.pagination?.hasMore),
          page: pageNum,
          isLoading: false,
          isLoadingMore: false,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load feed';
      set({ error: msg, isLoading: false, isLoadingMore: false });
      if (pageNum > 1) {
        useToastStore.getState().error(msg);
      }
    }
  },

  loadMoreFeed: async () => {
    const { page, hasMore, isLoadingMore } = get();
    if (!hasMore || isLoadingMore) return;
    await get().fetchFeed(page + 1);
  },

  createPost: async (postData) => {
    try {
      set({ isCreating: true });
      const res = await postApi.createPost(postData);
      const newPost = res.data?.data || res.data;

      if (newPost?._id) {
        set((state) => {
          if (state.posts.some((p) => String(p._id) === String(newPost._id))) {
            return { isCreating: false };
          }
          return {
            posts: [newPost, ...state.posts],
            isCreating: false,
          };
        });
        useUserStore.getState().handleSocketNewPost?.(newPost);
      } else {
        set({ isCreating: false });
      }

      useToastStore.getState().success('Post published successfully!');
      return { success: true, post: newPost };
    } catch (err) {
      set({ isCreating: false });
      const msg = err.response?.data?.message || 'Failed to publish post';
      useToastStore.getState().error(msg);
      return { success: false, error: msg };
    }
  },

  updatePost: async (postId, postData) => {
    try {
      set({ isUpdating: true });
      const res = await postApi.updatePost(postId, postData);
      const updatedPost = res.data?.data || res.data;

      set((state) => ({
        posts: state.posts.map((p) =>
          p._id === postId ? { ...p, ...updatedPost, isLiked: p.isLiked } : p
        ),
        isUpdating: false,
      }));

      useToastStore.getState().success('Post updated successfully!');
      return { success: true, post: updatedPost };
    } catch (err) {
      set({ isUpdating: false });
      const firstError = err.response?.data?.errors?.[0];
      const msg =
        (typeof firstError === 'string' ? firstError : firstError?.message) ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update post';
      useToastStore.getState().error(msg);
      return { success: false, error: msg };
    }
  },

  deletePost: async (postId) => {
    const previousPosts = get().posts;
    // Optimistic removal
    set({ posts: previousPosts.filter((p) => p._id !== postId) });

    try {
      await postApi.deletePost(postId);
      useToastStore.getState().success('Post deleted successfully');
      return { success: true };
    } catch (err) {
      // Rollback
      set({ posts: previousPosts });
      const msg = err.response?.data?.message || 'Failed to delete post';
      useToastStore.getState().error(msg);
      return { success: false, error: msg };
    }
  },

  toggleLike: async (postId) => {
    if (!postId) return;
    const { likingMap } = get();
    // In-flight mutex: ignore rapid double clicks
    if (likingMap?.[postId]) return;

    set((state) => ({
      likingMap: { ...state.likingMap, [postId]: true },
    }));

    const currentPost =
      get().posts.find((p) => String(p._id) === String(postId)) ||
      useUserStore.getState().userPosts.find((p) => String(p._id) === String(postId));

    const willLike = currentPost ? !currentPost.isLiked : true;
    const optimisticCount = Math.max(
      0,
      (currentPost?.likesCount || 0) + (willLike ? 1 : -1)
    );

    // Optimistic update in usePostStore
    set((state) => ({
      posts: state.posts.map((p) => {
        if (String(p._id) !== String(postId)) return p;
        return {
          ...p,
          isLiked: optimisticCount > 0 && willLike,
          likesCount: optimisticCount,
        };
      }),
    }));

    // Optimistic update in useUserStore
    useUserStore.setState((state) => ({
      userPosts: state.userPosts.map((p) => {
        if (String(p._id) !== String(postId)) return p;
        return {
          ...p,
          isLiked: optimisticCount > 0 && willLike,
          likesCount: optimisticCount,
        };
      }),
    }));

    try {
      const res = await postApi.toggleLike(postId);
      const data = res.data?.data;
      if (data) {
        const finalCount = Math.max(0, Number(data.likesCount) || 0);
        const finalIsLiked = finalCount > 0 && Boolean(data.isLiked);
        set((state) => ({
          posts: state.posts.map((p) =>
            String(p._id) === String(postId)
              ? { ...p, isLiked: finalIsLiked, likesCount: finalCount }
              : p
          ),
        }));
        useUserStore.setState((state) => ({
          userPosts: state.userPosts.map((p) =>
            String(p._id) === String(postId)
              ? { ...p, isLiked: finalIsLiked, likesCount: finalCount }
              : p
          ),
        }));
      }
    } catch (_err) {
      // Revert on error in both stores
      const revertLike = !willLike;
      const revertCount = Math.max(0, optimisticCount + (revertLike ? 1 : -1));
      set((state) => ({
        posts: state.posts.map((p) => {
          if (String(p._id) !== String(postId)) return p;
          return {
            ...p,
            isLiked: revertCount > 0 && revertLike,
            likesCount: revertCount,
          };
        }),
      }));
      useUserStore.setState((state) => ({
        userPosts: state.userPosts.map((p) => {
          if (String(p._id) !== String(postId)) return p;
          return {
            ...p,
            isLiked: revertCount > 0 && revertLike,
            likesCount: revertCount,
          };
        }),
      }));
      useToastStore.getState().error('Could not update like status');
    } finally {
      set((state) => {
        const next = { ...state.likingMap };
        delete next[postId];
        return { likingMap: next };
      });
    }
  },

  incrementCommentCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        String(p._id) === String(postId)
          ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
          : p
      ),
    }));
  },

  decrementCommentCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        String(p._id) === String(postId)
          ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) }
          : p
      ),
    }));
  },

  // Socket real-time handlers
  handleSocketNewPost: (newPost) => {
    if (!newPost?._id) return;
    set((state) => {
      if (state.posts.some((p) => String(p._id) === String(newPost._id))) return state;
      return { posts: [newPost, ...state.posts] };
    });
  },

  handleSocketDeletePost: (postId) => {
    if (!postId) return;
    set((state) => ({
      posts: state.posts.filter((p) => String(p._id) !== String(postId)),
    }));
  },

  handleSocketLikeUpdate: (postId, likesCount) => {
    if (!postId) return;
    const finalCount = Math.max(0, Number(likesCount) || 0);
    set((state) => ({
      posts: state.posts.map((p) => {
        if (String(p._id) !== String(postId)) return p;
        return {
          ...p,
          likesCount: finalCount,
          isLiked: finalCount === 0 ? false : p.isLiked,
        };
      }),
    }));
  },

  handleSocketCommentCount: (postId, commentsCount) => {
    if (!postId) return;
    set((state) => ({
      posts: state.posts.map((p) =>
        String(p._id) === String(postId) ? { ...p, commentsCount } : p
      ),
    }));
  },

  handleSocketUpdatePost: (updatedPost) => {
    if (!updatedPost?._id) return;
    set((state) => ({
      posts: state.posts.map((p) =>
        String(p._id) === String(updatedPost._id)
          ? { ...p, ...updatedPost, isLiked: p.isLiked }
          : p
      ),
    }));
  },

  handleSocketAuthorUpdate: (updatedUser) => {
    if (!updatedUser?._id) return;
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.author?._id === updatedUser._id || p.author?.username === updatedUser.username) {
          return {
            ...p,
            author: {
              ...p.author,
              avatar: updatedUser.avatar,
              fullName: updatedUser.fullName,
              username: updatedUser.username,
            },
          };
        }
        return p;
      }),
    }));
  },
}));

export default usePostStore;
