import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import PostCard from './PostCard';
import { PostSkeleton } from '../common/Loader';
import EmptyState from '../common/EmptyState';

export const PostList = ({
  posts = [],
  isLoading = false,
  error = '',
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  onRetry,
  onPostDeleted,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <p className="text-sm text-rose-500">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No posts in your feed"
        description="Follow other members or publish the first post to see updates here."
      />
    );
  }

  return (
    <div className="w-full">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={onPostDeleted}
        />
      ))}

      {hasMore && (
        <div className="py-4 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-5 py-2 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? 'Loading more posts...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;