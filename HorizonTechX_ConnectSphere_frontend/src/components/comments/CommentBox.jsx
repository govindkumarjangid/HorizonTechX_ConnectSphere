import React, { useState } from 'react';
import { Smile, Camera, Gift, Send } from 'lucide-react';
import { useAuth } from '../../store/useAuthStore';
import Avatar from '../users/Avatar';

export const CommentBox = ({ onSubmit, placeholder = 'Add a comment...' }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit?.(user, text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-2.5 pt-2">
      <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />

      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full h-9 pl-3.5 pr-20 sm:pr-24 rounded-full bg-slate-100/90 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden transition-all"
        />

        <div className="absolute right-1.5 sm:right-2 flex items-center gap-1 sm:gap-1.5 text-slate-400 dark:text-slate-500">
          <button
            type="button"
            className="p-1 hover:text-amber-500 transition-colors cursor-pointer"
            title="Add emoji"
            aria-label="Add emoji"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 hover:text-blue-500 transition-colors cursor-pointer"
            title="Attach photo"
            aria-label="Attach photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 hover:text-rose-500 transition-colors cursor-pointer hidden xs:inline-block"
            title="Send gift"
            aria-label="Send gift"
          >
            <Gift className="w-3.5 h-3.5" />
          </button>

          {text.trim() && (
            <button
              type="submit"
              className="p-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-0.5 cursor-pointer"
              aria-label="Submit comment"
            >
              <Send className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentBox;