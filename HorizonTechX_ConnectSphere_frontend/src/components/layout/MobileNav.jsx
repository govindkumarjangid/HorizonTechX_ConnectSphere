import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, User } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export const MobileNav = ({ onOpenCompose }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 px-4 pt-1.5 flex items-center justify-around"
    >
      {/* Downward fill extension to ensure zero gap on any mobile viewport, address bar movement, or elastic scroll */}
      <div className="absolute top-full left-0 right-0 h-24 bg-white dark:bg-slate-900 pointer-events-none" />

      {/* Center Action Button with Concentric Wave Arch (Lowered to align with Feed & Profile, Zero Box-Shadow) */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-20">
        {/* Wave Arch SVG */}
        <div className="w-[128px] h-[20px] overflow-visible">
          <svg
            viewBox="0 0 128 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
          >
            {/* Fill that covers the straight border-t underneath */}
            <path
              d="M 0,10 C 28,10 46,2 64,2 C 82,2 100,10 128,10 L 128,20 L 0,20 Z"
              className="fill-white dark:fill-slate-900"
            />
            {/* Smooth continuous wave contour with zero corners, concentric to button circle */}
            <path
              d="M 0,10 C 28,10 46,2 64,2 C 82,2 100,10 128,10"
              fill="none"
              className="stroke-slate-200/80 dark:stroke-slate-800"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Action Button: Vertically centered aligned with other navigation items, shadow-none */}
        <button
          type="button"
          onClick={onOpenCompose}
          aria-label="Create Post"
          className="absolute top-[4px] pointer-events-auto w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-none flex items-center justify-center transition-all active:scale-95 cursor-pointer ring-3 ring-white dark:ring-slate-900 flex-shrink-0"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

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

      {/* Flex spacer so Feed & Profile stay positioned on left and right */}
      <div className="w-12 h-10 pointer-events-none invisible flex-shrink-0" />

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
