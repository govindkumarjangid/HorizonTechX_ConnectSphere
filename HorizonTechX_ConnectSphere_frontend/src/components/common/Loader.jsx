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
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden mb-6 animate-pulse">
      <div className="w-full h-36 bg-slate-200 dark:bg-slate-800" />
      <div className="px-6 pb-6 pt-0 relative">
        <div className="-mt-12 mb-4">
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