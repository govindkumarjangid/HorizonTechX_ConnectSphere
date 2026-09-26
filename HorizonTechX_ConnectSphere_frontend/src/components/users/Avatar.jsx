import React from 'react';
import { useState } from 'react';

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
  '3xl': 'w-24 h-24 text-2xl',
};

const badgeSizeMap = {
  xs: 'w-1.5 h-1.5 ring-1',
  sm: 'w-2 h-2 ring-1.5',
  md: 'w-2.5 h-2.5 ring-2',
  lg: 'w-3 h-3 ring-2',
  xl: 'w-3.5 h-3.5 ring-2',
  '2xl': 'w-4 h-4 ring-2',
  '3xl': 'w-5 h-5 ring-4',
};

export const Avatar = ({
  src,
  alt = 'User avatar',
  size = 'md',
  isOnline = false,
  className = '',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const sizeClasses = sizeMap[size] || sizeMap.md;
  const badgeClasses = badgeSizeMap[size] || badgeSizeMap.md;

  const initials = alt
    ? alt
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none rounded-full ${sizeClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10 transition duration-200 hover:opacity-95"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-medium ring-1 ring-black/5 dark:ring-white/10"
        >
          {initials}
        </div>
      )}

      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 rounded-full bg-emerald-500 ring-white dark:ring-slate-900 ${badgeClasses}`}
        />
      )}
    </div>
  );
};

export default Avatar;