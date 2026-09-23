import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';

export const FollowButton = ({
  isFollowing = false,
  onToggle,
  size = 'md',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyles = {
    sm: 'px-3 py-1 text-xs font-medium',
    md: 'px-4 py-1.5 text-sm font-medium',
    lg: 'px-5 py-2 text-sm font-semibold',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer ${sizeStyles[size] || sizeStyles.md} ${
        isFollowing
          ? isHovered
            ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50'
            : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${className}`}
    >
      {isFollowing ? (
        isHovered ? (
          <span>Unfollow</span>
        ) : (
          <>
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Following</span>
          </>
        )
      ) : (
        <>
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;