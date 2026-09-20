import React from 'react';

export const Loader = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} border-slate-300 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 mb-4 animate-pulse space-y-4">
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
      <div className="w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden mb-6 animate-pulse">
      <div className="w-full h-44 bg-slate-200 dark:bg-slate-800" />
      <div className="px-6 pb-6 pt-0 relative">
        <div className="-mt-14 mb-4">
          <div className="w-24 h-24 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900" />
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

export default Loader;