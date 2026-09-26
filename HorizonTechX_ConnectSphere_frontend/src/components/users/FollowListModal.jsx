import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import Avatar from './Avatar';
import FollowButton from './FollowButton';
import Loader from '../common/Loader';
import useUserStore from '../../store/useUserStore';
import { followApi } from '../../api/followApi';

export const FollowListModal = ({ isOpen, onClose, username, type = 'followers' }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const toggleFollow = useUserStore((state) => state.toggleFollow);

  const fetchList = useCallback(
    async (pageNum = 1) => {
      if (!username) return;
      setIsLoading(true);
      try {
        const skip = (pageNum - 1) * LIMIT;
        const res =
          type === 'followers'
            ? await followApi.getFollowers(username, { skip, limit: LIMIT })
            : await followApi.getFollowing(username, { skip, limit: LIMIT });
        const data = res.data?.data;
        const newItems = data?.items || [];
        setItems((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
        setHasMore(data?.pagination?.hasMore || false);
        setPage(pageNum);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    },
    [username, type]
  );

  useEffect(() => {
    if (isOpen) {
      setItems([]);
      setPage(1);
      setHasMore(false);
      fetchList(1);
    }
  }, [isOpen, fetchList]);

  const handleFollowToggle = async (user) => {
    await toggleFollow(user._id, user.username);
    // Refresh the list
    setItems((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, isFollowing: !u.isFollowing } : u
      )
    );
  };

  const handleUserClick = (uname) => {
    onClose?.();
    navigate(`/profile/${uname}`);
  };

  const title = type === 'followers' ? 'Followers' : 'Following';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350, duration: 0.25 }}
            className="relative w-full max-w-md max-h-[90dvh] sm:max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10"
          >
            {/* Mobile grab handle */}
            <div className="pt-2 sm:hidden flex justify-center shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                {items.length > 0 && (
                  <span className="text-xs text-slate-400">({items.length})</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && items.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size="md" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-6">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No {title.toLowerCase()} yet
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {items.map((user) => (
                    <li key={user._id} className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2.5 sm:py-3">
                      <button
                        type="button"
                        onClick={() => handleUserClick(user.username)}
                        className="shrink-0 cursor-pointer"
                      >
                        <Avatar src={user.avatar} alt={user.username} size="md" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUserClick(user.username)}
                        className="flex-1 min-w-0 text-left cursor-pointer"
                      >
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {user.fullName || `@${user.username}`}
                        </p>
                        <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                        {user.bio && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.bio}</p>
                        )}
                      </button>
                      {!user.isSelf && (
                        <div className="shrink-0">
                          <FollowButton
                            isFollowing={user.isFollowing}
                            onToggle={() => handleFollowToggle(user)}
                            size="sm"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="py-3 text-center">
                  <button
                    onClick={() => fetchList(page + 1)}
                    disabled={isLoading}
                    className="px-4 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <Loader size="xs" /> : 'Load more'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FollowListModal;
