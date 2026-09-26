import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { Home, Plus, User } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export const MobileNav = ({ onOpenCompose }) => {
  const user = useAuthStore((state) => state.user);

  const navContent = (
    <nav
      aria-label="Mobile Bottom Navigation"
      style={{
        bottom: 0,
        paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))',
      }}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pt-1.5 flex items-center justify-around"
    >
      <div className="absolute inset-x-0 top-12.75 -bottom-28 bg-white dark:bg-slate-900 -z-20 pointer-events-none" />

      {/* Left Top Border & Solid Background */}
      <div className="absolute top-0 left-0 right-[calc(50%+71.5px)] h-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 -z-10 pointer-events-none" />

      {/* Right Top Border & Solid Background */}
      <div className="absolute top-0 left-[calc(50%+71.5px)] right-0 h-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 -z-10 pointer-events-none" />

      {/* Center Symmetrical Notch SVG: Circular Arcs (R=32, r=20 - Gentle Shoulder) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-13.5 overflow-visible pointer-events-none -z-10">
        <svg
          viewBox="0 0 144 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          {/* Solid fill below notch curve */}
          <path
            d="M 0,0 L 20,0 A 20 20 0 0 1 40,18.5 A 32 32 0 0 0 104,18.5 A 20 20 0 0 1 124,0 L 144,0 L 144,54 L 0,54 Z"
            className="fill-white dark:fill-slate-900"
          />
          {/* Continuous smooth circular arc notch curve seamlessly joining left & right top borders */}
          <path
            d="M 0,0 L 20,0 A 20 20 0 0 1 40,18.5 A 32 32 0 0 0 104,18.5 A 20 20 0 0 1 124,0 L 144,0"
            fill="none"
            className="stroke-slate-200/80 dark:stroke-slate-800"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Centered Action Button Lowered into Curve with Subtle Shadow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
        <button
          type="button"
          onClick={onOpenCompose}
          aria-label="Create Post"
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-600/35 dark:shadow-[0_6px_20px_rgba(37,99,235,0.45)] flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Feed */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-11 min-w-12.5 px-2 py-1 rounded-xl text-[11px] font-semibold transition-colors ${isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <Home className="w-5 h-5 stroke-2 mb-0.5" />
        <span>Feed</span>
      </NavLink>

      {/* Flex spacer matching notch width so Feed & Profile keep balanced spacing */}
      <div className="w-14 h-10 pointer-events-none invisible shrink-0" />

      {/* Profile */}
      <NavLink
        to={`/profile/${user?.username}`}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-h-11 min-w-12.5 px-2 py-1 rounded-xl text-[11px] font-semibold transition-colors ${isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`
        }
      >
        <User className="w-5 h-5 stroke-2 mb-0.5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );

  return typeof document !== 'undefined' ? createPortal(navContent, document.body) : navContent;
};

export default MobileNav;
