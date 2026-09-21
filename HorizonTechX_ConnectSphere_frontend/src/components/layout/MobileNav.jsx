import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, User } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export const MobileNav = ({ onOpenCompose }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-6 py-2 flex items-center justify-around"
    >
      {/* Feed */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-[44px] min-w-[50px] px-2 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <Home className="w-5 h-5 stroke-[2] mb-0.5" />
        <span>Feed</span>
      </NavLink>

      {/* Center Create Post button */}
      <button
        type="button"
        onClick={onOpenCompose}
        aria-label="Create Post"
        className="flex items-center justify-center -mt-4 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer ring-4 ring-white dark:ring-slate-900 flex-shrink-0"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Profile */}
      <NavLink
        to={`/profile/${user?.username}`}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-[44px] min-w-[50px] px-2 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <User className="w-5 h-5 stroke-[2] mb-0.5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
