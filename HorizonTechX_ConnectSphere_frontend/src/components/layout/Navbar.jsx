import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  Heart,
  MessageCircle,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../store/useThemeStore';
import Avatar from '../users/Avatar';
import Logo from '../common/Logo';
import { AnimatePresence, motion } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, clearUnread } = useSocket();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(max-width: 767px)').matches);
  });

  const notifMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const mobileSheetRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 767px)');
    const handleMql = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handleMql);
    return () => mql.removeEventListener('change', handleMql);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(e.target) &&
        (!mobileSheetRef.current || !mobileSheetRef.current.contains(e.target))
      ) {
        setIsNotifOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleToggleNotifications = () => {
    if (!isNotifOpen) clearUnread();
    setIsNotifOpen((prev) => !prev);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getNotifText = (n) => {
    switch (n.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      default:
        return 'interacted with your content';
    }
  };

  const renderNotificationList = (maxHClass = 'max-h-80') => (
    <div className={`overflow-y-auto ${maxHClass} divide-y divide-slate-100 dark:divide-slate-800/60`}>
      {notifications.length > 0 ? (
        notifications.map((n, idx) => (
          <div
            key={idx}
            onClick={() => {
              setIsNotifOpen(false);
              if (n.fromUser?.username) {
                navigate(`/profile/${n.fromUser.username}`);
              }
            }}
            className="p-3.5 sm:p-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="relative">
              <Avatar
                src={n.fromUser?.avatar}
                alt={n.fromUser?.username}
                size="sm"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center">
                {getNotifIcon(n.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="text-slate-800 dark:text-slate-200 leading-snug">
                <strong className="font-semibold text-slate-900 dark:text-white">
                  @{n.fromUser?.username}
                </strong>{' '}
                {getNotifText(n)}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Just now
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="py-12 sm:py-8 text-center text-xs text-slate-400">
          No notifications in this session yet.
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl 2xl:max-w-350 mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo — theme-adaptive text color */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-900 dark:text-white group shrink-0"
        >
          <Logo className="group-hover:scale-105 transition-transform" />
        </Link>

        {/* Center: Desktop Navigation items */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <Home className="w-4.5 h-4.5 stroke-2" />
            <span>Feed</span>
          </NavLink>
        </nav>

        {/* Right: Notification Bell, Theme Toggle & Profile Menu */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown / Trigger */}
          <div ref={notifMenuRef} className="relative">
            <button
              onClick={handleToggleNotifications}
              className="relative p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-bounce">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Desktop Dropdown (positioned under bell icon) */}
            <AnimatePresence>
              {isNotifOpen && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{ transformOrigin: 'top right' }}
                  className="hidden md:flex absolute right-0 mt-2 w-96 max-h-96 flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 overflow-hidden"
                >
                  <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Live Notifications
                      </h4>
                    </div>
                    {notifications.length > 0 && (
                      <span className="text-[11px] text-slate-400">
                        {notifications.length} received
                      </span>
                    )}
                  </div>

                  {renderNotificationList('max-h-80')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Sheet Portal (mounted directly to body, escapes header backdrop-filter) */}
          {typeof document !== 'undefined' &&
            createPortal(
              <AnimatePresence>
                {isNotifOpen && isMobile && (
                  <div className="fixed inset-0 z-50 md:hidden">
                    {/* Mobile Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
                      onClick={() => setIsNotifOpen(false)}
                    />

                    {/* Mobile Bottom Sheet Drawer */}
                    <motion.div
                      ref={mobileSheetRef}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
                      className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl"
                    >
                      {/* Downward fill extension to ensure 0 gap on mobile viewport */}
                      <div className="absolute top-full left-0 right-0 h-24 bg-white dark:bg-slate-900 pointer-events-none" />

                      {/* Mobile Grab Handle */}
                      <div className="pt-3 pb-1 flex justify-center">
                        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
                      </div>

                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Live Notifications
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {notifications.length > 0 && (
                            <span className="text-[11px] text-slate-400">
                              {notifications.length} received
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsNotifOpen(false)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            aria-label="Close notifications"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {renderNotificationList('max-h-[62vh]')}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>,
              document.body
            )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile trigger & dropdown */}
          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Avatar src={user?.avatar} alt={user?.username} size="sm" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 max-w-25 truncate hidden sm:inline">
                @{user?.username}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5] transition-transform duration-200 ${
                  isProfileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Signed in as
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                      @{user?.username}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to={`/profile/${user?.username}`}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;