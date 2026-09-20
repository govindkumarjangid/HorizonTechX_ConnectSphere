import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import { mockTrendingTopics } from '../../utils/mockData';
import { useUserStore } from '../../store/useUserStore';
import Avatar from '../users/Avatar';
import FollowButton from '../users/FollowButton';

export const RightSidebar = () => {
  const { users, toggleFollow } = useUserStore();
  const navigate = useNavigate();

  // Pick top suggested users to follow
  const suggestedUsers = users.slice(0, 5);

  return (
    <aside className="w-full space-y-4">
      {/* Trending Topic Card matching Screenshot 4 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trending
            </span>{' '}
            Topic
          </h3>
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </div>

        <div className="space-y-3">
          {mockTrendingTopics.slice(0, 6).map((topic, idx) => (
            <div
              key={`trend_${idx}`}
              onClick={() => navigate(`/search?q=${encodeURIComponent(topic.tag)}`)}
              className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                  {topic.tag}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {topic.postsCount}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/explore"
          className="inline-block mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          See more
        </Link>
      </div>

      {/* Who to follow Card matching Screenshot 4 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Who to follow
          </h3>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <div className="space-y-3.5">
          {suggestedUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-2.5 group"
            >
              <div
                onClick={() => navigate(`/profile/${u.username}`)}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
              >
                <Avatar src={u.avatar} alt={u.fullName} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {u.fullName}
                    </span>
                    {u.isVerified && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500 dark:fill-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {u.role || `@${u.username}`}
                  </p>
                </div>
              </div>

              <FollowButton
                isFollowing={u.isFollowing}
                onToggle={() => toggleFollow(u.id)}
                size="sm"
              />
            </div>
          ))}
        </div>

        <Link
          to="/connections"
          className="inline-block mt-4 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          See more
        </Link>
      </div>
    </aside>
  );
};

export default RightSidebar;
