import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Avatar from '../users/Avatar';

export const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <aside className="w-full space-y-4">
      {/* User Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            size="lg"
            onClick={() => navigate(`/profile/${user?.username}`)}
          />
          <div className="min-w-0 flex-1">
            <Link
              to={`/profile/${user?.username}`}
              className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
            >
              {user?.fullName || `@${user?.username}`}
            </Link>
            <p className="text-xs text-slate-400 truncate">
              @{user?.username}
            </p>
            {user?.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-center mb-4">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {user?.followersCount || 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Followers</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {user?.followingCount || 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Following</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {user?.postsCount || 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Posts</p>
          </div>
        </div>

        <Link
          to={`/profile/${user?.username}`}
          className="block w-full py-2.5 px-3 text-center text-xs font-semibold rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          View your profile
        </Link>
      </div>

      <div className="px-2 text-[11px] text-slate-400 dark:text-slate-500">
        Connectly © 2026
      </div>
    </aside>
  );
};

export default Sidebar;