import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'md', className = '', text = '', fullPage = false }) => {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const iconClass = `${sizeMap[size] || sizeMap.md} animate-spin ${className || 'text-blue-600 dark:text-blue-400'}`;
  const icon = <Loader2 className={iconClass} />;

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 p-6">
        {icon}
        {text && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{text}</p>}
      </div>
    );
  }

  if (text) {
    return (
      <div className="inline-flex items-center gap-2">
        {icon}
        <span className="text-xs text-slate-500 dark:text-slate-400">{text}</span>
      </div>
    );
  }

  return icon;
};

export const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 mb-2.5 sm:mb-4 animate-pulse space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-1.5 flex-1">
          <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="w-20 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="w-4/5 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
      <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="flex justify-between pt-2">
        <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden mb-3 sm:mb-6 animate-pulse">
      <div className="w-full h-24 sm:h-36 bg-slate-200 dark:bg-slate-800" />
      <div className="px-3.5 sm:px-6 pb-3.5 sm:pb-6 pt-0 relative">
        <div className="-mt-10 sm:-mt-12 mb-3 sm:mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900" />
        </div>
        <div className="space-y-3">
          <div className="w-48 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          <div className="w-full max-w-md h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const NavbarSkeleton = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo Skeleton */}
        <div className="flex items-center gap-2.5 animate-pulse">
          <div className="w-9 h-9 rounded-2xl bg-blue-600/30" />
          <div className="w-24 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>

        {/* Center Nav Link Skeleton */}
        <div className="hidden md:flex items-center gap-2 animate-pulse">
          <div className="w-20 h-9 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
        </div>

        {/* Right Actions Skeleton */}
        <div className="flex items-center gap-2 sm:gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
          <div className="w-9 h-9 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="hidden lg:block w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>
    </header>
  );
};

export const SidebarSkeleton = () => {
  return (
    <aside className="w-full space-y-4 animate-pulse">
      {/* User Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2 flex-1">
            <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          </div>
        </div>
        <div className="space-y-1.5 my-3">
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          <div className="w-4/5 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
        </div>
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-center mb-4">
          <div className="space-y-1">
            <div className="w-6 h-3 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
            <div className="w-12 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded mx-auto" />
          </div>
          <div className="space-y-1">
            <div className="w-6 h-3 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
            <div className="w-12 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded mx-auto" />
          </div>
          <div className="space-y-1">
            <div className="w-6 h-3 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
            <div className="w-10 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded mx-auto" />
          </div>
        </div>
        <div className="w-full h-9 bg-slate-100 dark:bg-slate-800/70 rounded-2xl" />
      </div>

      {/* Nav List Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-xs space-y-2">
        <div className="w-full h-9 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        <div className="w-full h-9 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        <div className="w-full h-9 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
      </div>
    </aside>
  );
};

export const RightSidebarSkeleton = () => {
  return (
    <aside className="w-full space-y-4 animate-pulse">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-blue-600/30" />
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="space-y-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="w-14 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                </div>
              </div>
              <div className="w-16 h-7 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export const FeedFormSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 mb-4 shadow-xs animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="w-full h-11 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
              <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
            </div>
            <div className="w-16 h-8 bg-blue-600/30 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const LayoutSkeleton = ({ isProfile = false }) => {
  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <NavbarSkeleton />
      <main className="flex-1 max-w-7xl 2xl:max-w-350 w-full mx-auto px-2 sm:px-6 lg:px-8 py-2.5 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-5 lg:gap-6 items-start">
          {/* Left Column (3 cols on lg) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-20">
            <SidebarSkeleton />
          </div>

          {/* Center Column (6 cols on lg) */}
          <div className="col-span-12 md:col-span-8 lg:col-span-6 min-w-0 pb-20 md:pb-6 space-y-4">
            {isProfile ? (
              <>
                <ProfileSkeleton />
                <PostSkeleton />
              </>
            ) : (
              <>
                <FeedFormSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}
          </div>

          {/* Right Column (3 cols on lg) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <RightSidebarSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Loader;