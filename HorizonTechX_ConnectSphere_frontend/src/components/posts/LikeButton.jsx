import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const LikeButton = ({ isLiked = false, likesCount = 0, onToggle }) => {
  const count = typeof likesCount === 'number' ? Math.max(0, likesCount) : 0;

  const active = Boolean(isLiked && count > 0);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer group ${
        active
          ? 'text-rose-600 dark:text-rose-400'
          : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
      }`}
      aria-label={active ? 'Unlike post' : 'Like post'}
    >
      <motion.div
        whileTap={{ scale: 0.75 }}
        animate={active ? { scale: [1, 1.35, 0.9, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            active
              ? 'fill-rose-500 text-rose-500'
              : 'text-slate-500 dark:text-slate-400 group-hover:text-rose-500 stroke-2'
          }`}
        />
      </motion.div>
      {count > 0 && (
        <span className={active ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}>
          {count}
        </span>
      )}
    </button>
  );
};

export default LikeButton;