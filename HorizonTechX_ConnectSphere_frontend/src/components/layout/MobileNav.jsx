import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, MessageSquare, Bell } from 'lucide-react';
export const MobileNav = ({ onOpenCompose }) => {
  const unreadMsgCount = 2;
  const unreadNotifsCount = 2;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around safe-bottom"
    >
      {/* 1. Feed */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl text-[10px] font-semibold transition-colors ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <Home className="w-5 h-5 stroke-[2] mb-0.5" />
        <span>Feed</span>
      </NavLink>

      {/* 2. Explore */}
      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl text-[10px] font-semibold transition-colors ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <Compass className="w-5 h-5 stroke-[2] mb-0.5" />
        <span>Explore</span>
      </NavLink>

      {/* 3. Center Create Post button */}
      <button
        type="button"
        onClick={onOpenCompose}
        aria-label="Create Post"
        className="flex items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/30 transition-transform active:scale-95 cursor-pointer ring-4 ring-white dark:ring-slate-900 flex-shrink-0"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* 4. Messages with badge */}
      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl text-[10px] font-semibold transition-colors relative ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 stroke-[2] mb-0.5" />
          {unreadMsgCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              {unreadMsgCount}
            </span>
          )}
        </div>
        <span>Messages</span>
      </NavLink>

      {/* 5. Notifications with badge */}
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl text-[10px] font-semibold transition-colors relative ${
            isActive
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <div className="relative">
          <Bell className="w-5 h-5 stroke-[2] mb-0.5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              {unreadNotifsCount}
            </span>
          )}
        </div>
        <span>Alerts</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
