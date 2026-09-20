import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import PostCard from './PostCard';
import EmptyState from '../common/EmptyState';
import { FEED_TABS, SORT_OPTIONS } from '../../utils/constants';
import { usePostStore } from '../../store/usePostStore';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

export const PostList = () => {
  const { posts, activeTab, setActiveTab, sortBy, setSortBy } = usePostStore();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter posts based on active tab
  const filteredPosts = React.useMemo(() => {
    let result = [...posts];
    if (activeTab === 'following') {
      result = result.filter(
        (p) => p.author?.username !== 'alanp'
      );
    } else if (activeTab === 'latest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Trending: sort by likes
      result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    }
    return result;
  }, [posts, activeTab]);

  // Reset pagination when active tab or sort order changes (React recommended pattern)
  const [prevFilterKey, setPrevFilterKey] = useState(`${activeTab}-${sortBy}`);
  const currentFilterKey = `${activeTab}-${sortBy}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(5);
  }

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 4, filteredPosts.length));
  }, [filteredPosts.length]);

  const hasMore = visibleCount < filteredPosts.length;
  const { observerRef } = useInfiniteScroll(handleLoadMore, hasMore);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="w-full">
      {/* Feed Tabs & Sort Filter matching Screenshot 1 & 4 */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800">
        {/* Tabs: Trending, Following, etc. with indicator */}
        <div className="flex items-center gap-6">
          {FEED_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-1 text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="feedTabIndicator"
                    className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 rounded-full"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Sort by: Top v matching Screenshot 1 */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Sort by :</span>
            <strong className="capitalize text-slate-700 dark:text-slate-200">
              {sortBy}
            </strong>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-20">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSortBy(opt.id);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    sortBy === opt.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts Feed Stream */}
      {visiblePosts.length > 0 ? (
        <AnimatePresence mode="popLayout">
          {visiblePosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.2) }}
            >
              <PostCard post={post} priority={idx === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No posts yet"
          description="Be the first to share something inspiring with the community."
          actionLabel="Share a post"
          onAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-8 w-full flex items-center justify-center py-2"
        >
          <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PostList;