import React, { useEffect } from 'react';
import PostForm from '../components/posts/PostForm';
import PostList from '../components/posts/PostList';
import usePostStore from '../store/usePostStore';

export const Feed = () => {
  const posts = usePostStore((state) => state.posts);
  const isLoading = usePostStore((state) => state.isLoading);
  const isLoadingMore = usePostStore((state) => state.isLoadingMore);
  const hasMore = usePostStore((state) => state.hasMore);
  const error = usePostStore((state) => state.error);
  const fetchFeed = usePostStore((state) => state.fetchFeed);
  const loadMoreFeed = usePostStore((state) => state.loadMoreFeed);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  return (
    <div className="w-full">
      <PostForm />
      <PostList
        posts={posts}
        isLoading={isLoading}
        error={error}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMoreFeed}
        onRetry={() => fetchFeed(1)}
      />
    </div>
  );
};

export default Feed;