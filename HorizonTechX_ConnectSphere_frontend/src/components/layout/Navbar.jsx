import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Home,
  Users,
  MessageSquare,
  Bell,
  Compass,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  MessageCircleQuestion,
  LogOut,
  Moon,
  Sun,
  Layers,
  Sparkles,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../store/useAuthStore';
import { useTheme } from '../../store/useThemeStore';
import Avatar from '../users/Avatar';
import SearchDropdown from '../common/SearchDropdown';
import { mockUsers } from '../../utils/mockData';
import { useDebounce } from '../../hooks/useDebounce';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadNotifsCount] = useState(2);
  const [unreadMsgCount] = useState(2);

  const searchContainerRef = useRef(null);
  const profileMenuRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results for dropdown using debounced query
  const filteredSearchResults = React.useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    const q = debouncedSearchQuery.toLowerCase();
    const userMatches = mockUsers
      .filter((u) => u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
      .slice(0, 2)
      .map((u) => ({
        type: 'user',
        title: u.fullName,
        subtitle: u.username,
        avatar: u.avatar,
        username: u.username,
      }));

    const companyMatches = [
      { type: 'company', title: 'HorizonTechX', subtitle: 'Technology & Design Labs' },
      { type: 'company', title: 'Twitter', subtitle: 'Social Media Platform' },
      { type: 'company', title: 'Apple', subtitle: 'Business Company' },
    ].filter((c) => c.title.toLowerCase().includes(q));

    const locationMatches = [
      { type: 'location', title: 'Istanbul, Turkey', subtitle: 'Eurasia Hub' },
      { type: 'location', title: 'San Francisco, CA', subtitle: 'Innovation District' },
      { type: 'location', title: 'Florence, Italy', subtitle: 'Art & Renaissance Center' },
    ].filter((l) => l.title.toLowerCase().includes(q));

    return [...userMatches, ...companyMatches, ...locationMatches].slice(0, 4);
  }, [debouncedSearchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileSearchExpanded(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { label: 'Homepage', to: '/', icon: Home },
    { label: 'Connections', to: '/connections', icon: Users },
    {
      label: 'Messages',
      to: '/messages',
      icon: MessageSquare,
      badge: unreadMsgCount,
    },
    {
      label: 'Notifications',
      to: '/notifications',
      icon: Bell,
      badge: unreadNotifsCount,
    },
    { label: 'Explore', to: '/explore', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors safe-top">
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {isMobileSearchExpanded ? (
          /* Expandable Full-Width Mobile Search Bar (< 640px) */
          <div className="w-full flex items-center gap-2 py-1">
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchExpanded(false);
                setIsSearchOpen(false);
              }}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Back to feed"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div ref={searchContainerRef} className="relative flex-1">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search people, tags, posts..."
                  className="w-full h-10 pl-4 pr-9 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              <SearchDropdown
                query={searchQuery}
                results={filteredSearchResults}
                isOpen={isSearchOpen && searchQuery.trim().length > 0}
                onClose={() => {
                  setIsSearchOpen(false);
                  setIsMobileSearchExpanded(false);
                }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left: Brand Logo + Desktop Search Form */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
              <Link
                to="/"
                className="flex items-center gap-2 text-slate-900 dark:text-white group flex-shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-xs shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="font-bold text-base sm:text-lg tracking-tight">
                  Connect<span className="text-blue-600 dark:text-blue-400">Sphere</span>
                </span>
              </Link>

              {/* Desktop/Tablet Pill Search Bar (visible on sm+) */}
              <div ref={searchContainerRef} className="relative w-full hidden sm:block">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder="Search"
                      className="w-full h-10 pl-10 pr-9 rounded-full bg-slate-100/90 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-3 focus:ring-blue-500/15 transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }}
                        className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </form>

                <SearchDropdown
                  query={searchQuery}
                  results={filteredSearchResults}
                  isOpen={isSearchOpen && searchQuery.trim().length > 0}
                  onClose={() => setIsSearchOpen(false)}
                />
              </div>
            </div>

        {/* Center: Desktop Navigation items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4.5 h-4.5 stroke-[2]" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Search trigger (mobile), Theme Toggle + User Menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Trigger Button (only on screens < sm) */}
          <button
            type="button"
            onClick={() => setIsMobileSearchExpanded(true)}
            className="sm:hidden p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile trigger matching Screenshot 1 & 2 */}
          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Avatar src={user?.avatar} alt={user?.fullName} size="sm" isOnline />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 max-w-[110px] truncate hidden sm:inline">
                {user?.fullName || 'Profile'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5]" />
            </button>

            {/* Profile Dropdown Menu matching Screenshot 1 */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Profile
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    @{user?.username}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>Change Account</span>
                  </button>
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </Link>
                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Help</span>
                  </a>
                  <a
                    href="#feedback"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <MessageCircleQuestion className="w-4 h-4 text-slate-400" />
                    <span>Give a feedback</span>
                  </a>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 px-4 pt-2.5 pb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Your Company
                  </span>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                        H
                      </div>
                      <div className="truncate">
                        <p className="font-semibold truncate">HorizonTechX</p>
                        <p className="text-[10px] text-slate-400">Design Systems & Labs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 px-4 pt-2.5 pb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Your Projects
                  </span>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                        C
                      </div>
                      <div className="truncate">
                        <p className="font-semibold truncate">ConnectSphere</p>
                        <p className="text-[10px] text-slate-400">Social Architecture</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
</header>
  );
};

export default Navbar;