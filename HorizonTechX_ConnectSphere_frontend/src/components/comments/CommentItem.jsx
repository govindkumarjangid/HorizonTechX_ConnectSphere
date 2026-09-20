import React from 'react';
import { Heart } from 'lucide-react';
import Avatar from '../users/Avatar';

export const CommentItem = ({ comment, onLike }) => {
  return (
    <div className="flex items-start gap-2.5 py-2 group">
      <Avatar
        src={comment.author?.avatar}
        alt={comment.author?.fullName}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-slate-100/80 dark:bg-slate-800/70 rounded-2xl px-3.5 py-2 inline-block max-w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {comment.author?.fullName}
            </span>
            <span className="text-[10px] text-slate-400">
              {comment.timestamp}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 break-words">
            {comment.text}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1 ml-2 text-[11px] text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onLike?.(comment.id)}
            className={`flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer ${
              comment.isLiked ? 'text-rose-500 font-semibold' : ''
            }`}
          >
            <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-rose-500' : ''}`} />
            <span>{comment.likesCount || 0}</span>
          </button>
          <button className="hover:text-blue-500 transition-colors cursor-pointer">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;