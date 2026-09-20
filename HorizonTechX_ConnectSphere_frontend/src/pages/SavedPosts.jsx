import React from 'react';
import { Bookmark } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import PostCard from '../components/posts/PostCard';
import EmptyState from '../components/common/EmptyState';

export const SavedPosts = () => {
  const { posts } = usePostStore();
  const bookmarkedPosts = posts.filter((p) => p.isBookmarked);

  return (
    <div className="w-full space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-blue-600/20" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Saved Posts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Articles, media, and design references you have bookmarked
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <EmptyState
            icon={Bookmark}
            title="No saved posts yet"
            description="When you see a post you want to revisit later, click the bookmark icon."
          />
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
