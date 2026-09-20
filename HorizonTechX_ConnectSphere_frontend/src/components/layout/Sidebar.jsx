import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '../../store/useAuthStore';
import Avatar from '../users/Avatar';
import { mockCommunities } from '../../utils/mockData';

export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-full space-y-4">
      {/* User Summary Card matching Screenshot 1 & 4 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              src={user?.avatar}
              alt={user?.fullName}
              size="lg"
              onClick={() => navigate('/profile')}
            />
            <div className="min-w-0">
              <Link
                to="/profile"
                className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
              >
                {user?.fullName}
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.location || 'Global Citizen'}
              </p>
            </div>
          </div>
          <Link
            to="/settings"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-center mb-4">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {user?.followersCount || '2.4k'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Followers</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {user?.followingCount || '480'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Following</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {user?.postsCount || '42'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Posts</p>
          </div>
        </div>

        <Link
          to="/profile"
          className="block w-full py-2 px-3 text-center text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          See your profile
        </Link>
      </div>

      {/* Pages Section matching Screenshot 1 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Your Pages
          </span>
        </div>

        <div className="space-y-2.5">
          {user?.pages?.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full ${page.color || 'bg-blue-500'} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs`}
                >
                  {page.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {page.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {page.category}
                  </p>
                </div>
              </div>

              {page.badge ? (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {page.badge}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <Link
          to="/communities"
          className="inline-block mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Projects Section matching Screenshot 1 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Your Projects
          </span>
        </div>

        <div className="space-y-2.5">
          {user?.projects?.map((proj) => (
            <div
              key={proj.id}
              className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full ${proj.color || 'bg-indigo-600'} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs`}
                >
                  {proj.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {proj.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {proj.category}
                  </p>
                </div>
              </div>

              {proj.badge ? (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {proj.badge}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <Link
          to="/communities"
          className="inline-block mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Communities Section matching Screenshot 4 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Your Community
          </span>
        </div>

        <div className="space-y-2">
          {mockCommunities.slice(0, 3).map((comm) => (
            <Link
              key={comm.id}
              to="/communities"
              className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={comm.avatar}
                  alt={comm.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                  {comm.name}
                </span>
              </div>
              {comm.hasUnread && (
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Links matching Screenshot 1 */}
      <div className="px-2 py-2 text-[11px] text-slate-400 dark:text-slate-500 space-y-1.5">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#privacy" className="hover:underline">Privacy</a>
          <span>·</span>
          <a href="#terms" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="#advertising" className="hover:underline">Advertising</a>
          <span>·</span>
          <a href="#cookies" className="hover:underline">Cookies</a>
        </div>
        <p className="text-[10px]">HorizonTechX ConnectSphere © 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;