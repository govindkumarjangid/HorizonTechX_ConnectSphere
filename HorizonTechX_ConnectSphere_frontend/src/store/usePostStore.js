import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { mockPosts } from '../utils/mockData';

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_posts');
      if (saved) return JSON.parse(saved);
    } catch (_e) {
      // ignore JSON parse error
    }
    return mockPosts;
  });

  const [activeTab, setActiveTab] = useState('trending');
  const [sortBy, setSortBy] = useState('top');
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Non-blocking deferred persistence to prevent frame drops
  const persistTimeoutRef = useRef(null);
  const scheduleSave = useCallback((newPosts) => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }
    persistTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('cs_posts', JSON.stringify(newPosts));
      } catch (_e) {
        // ignore quota errors
      }
    }, 120);
  }, []);

  const showToast = useCallback((message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    };
  }, []);

  const createPost = useCallback((newPostData) => {
    const newPost = {
      id: `post_${Date.now()}`,
      author: newPostData.author,
      content: newPostData.content,
      images: newPostData.images || [],
      video: newPostData.video || null,
      visibility: newPostData.visibility || 'public',
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
      isBookmarked: false,
      comments: [],
    };
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      scheduleSave(updated);
      return updated;
    });
    showToast('Your post has been published.');
    return newPost;
  }, [scheduleSave, showToast]);

  const toggleLike = useCallback((postId) => {
    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      });
      scheduleSave(updated);
      return updated;
    });
  }, [scheduleSave]);

  const toggleBookmark = useCallback((postId) => {
    let stateMessage = '';
    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const isBookmarked = !post.isBookmarked;
          stateMessage = isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks';
          return {
            ...post,
            isBookmarked,
          };
        }
        return post;
      });
      scheduleSave(updated);
      return updated;
    });
    if (stateMessage) showToast(stateMessage);
  }, [scheduleSave, showToast]);

  const deletePost = useCallback((postId) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      scheduleSave(updated);
      return updated;
    });
    showToast('Post deleted.');
  }, [scheduleSave, showToast]);

  const addComment = useCallback((postId, user, text) => {
    if (!text || !text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      author: {
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar,
      },
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const comments = [...(post.comments || []), newComment];
          return {
            ...post,
            comments,
            commentsCount: (post.commentsCount || 0) + 1,
          };
        }
        return post;
      });
      scheduleSave(updated);
      return updated;
    });
    showToast('Comment added');
  }, [scheduleSave, showToast]);

  const toggleCommentLike = useCallback((postId, commentId) => {
    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const comments = (post.comments || []).map((c) => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likesCount: isLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 0) - 1),
              };
            }
            return c;
          });
          return { ...post, comments };
        }
        return post;
      });
      scheduleSave(updated);
      return updated;
    });
  }, [scheduleSave]);

  const contextValue = useMemo(
    () => ({
      posts,
      activeTab,
      setActiveTab,
      sortBy,
      setSortBy,
      createPost,
      toggleLike,
      toggleBookmark,
      deletePost,
      addComment,
      toggleCommentLike,
      toastMessage,
      showToast,
    }),
    [
      posts,
      activeTab,
      sortBy,
      createPost,
      toggleLike,
      toggleBookmark,
      deletePost,
      addComment,
      toggleCommentLike,
      toastMessage,
      showToast,
    ]
  );

  return React.createElement(
    PostContext.Provider,
    { value: contextValue },
    children
  );
};

export const usePostStore = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostStore must be used within a PostProvider');
  }
  return context;
};

export default usePostStore;