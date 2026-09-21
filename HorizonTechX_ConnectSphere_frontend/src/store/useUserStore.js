import { create } from 'zustand';
import userApi from '../api/userApi';
import followApi from '../api/followApi';
import useAuthStore from './useAuthStore';
import useToastStore from './useToastStore';

export const useUserStore = create((set, get) => ({
  profile: null,
  userPosts: [],
  suggestions: [],
  isLoadingProfile: false,
  isLoadingPosts: false,
  isLoadingSuggestions: false,
  isUpdatingProfile: false,
  error: null,

  fetchProfile: async (username) => {
    if (!username) return;
    set({ isLoadingProfile: true, error: null });

    try {
      const res = await userApi.getUserProfile(username);
      const data = res.data?.data || res.data;
      set({ profile: data, isLoadingProfile: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'User not found';
      set({ error: msg, profile: null, isLoadingProfile: false });
      useToastStore.getState().error(msg);
    }
  },

  fetchUserPosts: async (username) => {
    if (!username) return;
    set({ isLoadingPosts: true });

    try {
      const res = await userApi.getUserPosts(username);
      const items = res.data?.data?.items || [];
      set({ userPosts: items, isLoadingPosts: false });
    } catch {
      set({ userPosts: [], isLoadingPosts: false });
    }
  },

  updateProfile: async (formDataOrData) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await userApi.updateProfile(formDataOrData);
      const updatedUser = res.data?.data || res.data;

      // Update auth store user
      useAuthStore.getState().updateUser(updatedUser);

      // Update current profile if viewing self
      if (get().profile && String(get().profile._id) === String(updatedUser._id)) {
        set((state) => ({
          profile: { ...state.profile, ...updatedUser },
          isUpdatingProfile: false,
        }));
      } else {
        set({ isUpdatingProfile: false });
      }

      useToastStore.getState().success('Profile updated successfully');
      return { success: true, user: updatedUser };
    } catch (err) {
      set({ isUpdatingProfile: false });
      const firstError = err.response?.data?.errors?.[0];
      const msg =
        (typeof firstError === 'string' ? firstError : firstError?.message) ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update profile';
      useToastStore.getState().error(msg);
      return { success: false, error: msg };
    }
  },

  toggleFollow: async (targetUserId, targetUsername) => {
    const currentProfile = get().profile;
    const isTargetProfile = currentProfile && currentProfile._id === targetUserId;
    const willFollow = isTargetProfile ? !currentProfile.isFollowing : true;

    // Optimistic profile update
    if (isTargetProfile) {
      set((state) => ({
        profile: {
          ...state.profile,
          isFollowing: willFollow,
          followersCount: Math.max(0, (state.profile.followersCount || 0) + (willFollow ? 1 : -1)),
        },
      }));
    }

    // Optimistic suggestions update
    set((state) => ({
      suggestions: state.suggestions.map((u) =>
        u._id === targetUserId ? { ...u, isFollowing: !u.isFollowing } : u
      ),
    }));

    try {
      if (willFollow) {
        await followApi.followUser(targetUserId);
        useToastStore.getState().success(`Followed @${targetUsername || 'user'}`);
      } else {
        await followApi.unfollowUser(targetUserId);
        useToastStore.getState().info(`Unfollowed @${targetUsername || 'user'}`);
      }
      return { success: true };
    } catch (err) {
      // Revert profile
      if (isTargetProfile) {
        set((state) => ({
          profile: {
            ...state.profile,
            isFollowing: !willFollow,
            followersCount: Math.max(0, (state.profile.followersCount || 0) + (!willFollow ? 1 : -1)),
          },
        }));
      }
      // Revert suggestions
      set((state) => ({
        suggestions: state.suggestions.map((u) =>
          u._id === targetUserId ? { ...u, isFollowing: !u.isFollowing } : u
        ),
      }));

      const msg = err.response?.data?.message || 'Follow action failed';
      useToastStore.getState().error(msg);
      return { success: false, error: msg };
    }
  },

  fetchSuggestions: async (limit = 5) => {
    set({ isLoadingSuggestions: true });
    try {
      const res = await userApi.getSuggestions({ limit });
      const items = res.data?.data || [];
      set({ suggestions: items, isLoadingSuggestions: false });
    } catch {
      set({ suggestions: [], isLoadingSuggestions: false });
    }
  },

  // Socket real-time handlers
  handleSocketFollowUpdate: ({ targetUserId, followersCount, followerId, followingCount }) => {
    set((state) => {
      const currentProfile = state.profile;
      if (!currentProfile) return state;

      if (String(currentProfile._id) === String(targetUserId)) {
        return {
          profile: { ...currentProfile, followersCount },
        };
      }
      if (String(currentProfile._id) === String(followerId)) {
        return {
          profile: { ...currentProfile, followingCount },
        };
      }
      return state;
    });

    // Also update auth user if self
    const authUser = useAuthStore.getState().user;
    if (authUser) {
      if (String(authUser._id) === String(targetUserId)) {
        useAuthStore.getState().updateUser({ followersCount });
      }
      if (String(authUser._id) === String(followerId)) {
        useAuthStore.getState().updateUser({ followingCount });
      }
    }
  },

  handleSocketProfileUpdate: (updatedUser) => {
    if (!updatedUser?._id) return;
    set((state) => {
      if (state.profile && String(state.profile._id) === String(updatedUser._id)) {
        return {
          profile: { ...state.profile, ...updatedUser },
        };
      }
      return state;
    });
  },

  handleSocketDeletePost: (postId) => {
    if (!postId) return;
    set((state) => ({
      userPosts: state.userPosts.filter((p) => p._id !== postId),
    }));
  },

  handleSocketLikeUpdate: (postId, likesCount) => {
    if (!postId) return;
    set((state) => ({
      userPosts: state.userPosts.map((p) =>
        p._id === postId ? { ...p, likesCount } : p
      ),
    }));
  },

  handleSocketCommentCount: (postId, commentsCount) => {
    if (!postId) return;
    set((state) => ({
      userPosts: state.userPosts.map((p) =>
        p._id === postId ? { ...p, commentsCount } : p
      ),
    }));
  },

  handleSocketUpdatePost: (updatedPost) => {
    if (!updatedPost?._id) return;
    set((state) => ({
      userPosts: state.userPosts.map((p) =>
        p._id === updatedPost._id
          ? { ...p, ...updatedPost, isLiked: p.isLiked }
          : p
      ),
    }));
  },
}));

export default useUserStore;
