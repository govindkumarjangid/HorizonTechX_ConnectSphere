import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const LikeButton = ({ isLiked, likesCount, onToggle }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer group"
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <motion.div
        whileTap={{ scale: 0.75 }}
        animate={isLiked ? { scale: [1, 1.35, 0.9, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isLiked
              ? 'fill-rose-500 text-rose-500'
              : 'text-slate-500 dark:text-slate-400 group-hover:text-rose-500 stroke-[2]'
          }`}
        />
      </motion.div>
      {/* Always show the count, even when 0 — only color it red when actually liked */}
      <span className={isLiked ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}>
        {typeof likesCount === 'number' ? likesCount : 0}
      </span>
    </button>
  );
};

export default LikeButton;