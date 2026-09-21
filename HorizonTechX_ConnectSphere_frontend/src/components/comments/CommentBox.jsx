import React, { useState } from 'react';
import { Send } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Avatar from '../users/Avatar';
import Loader from '../common/Loader';

export const CommentBox = ({ onSubmit, isSubmitting = false }) => {
  const user = useAuthStore((state) => state.user);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    onSubmit?.(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2" noValidate>
      <Avatar src={user?.avatar} alt={user?.username} size="sm" />

      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          maxLength={1000}
          className="w-full h-9 pl-3.5 pr-10 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:outline-hidden transition-all"
        />

        {text.trim() && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="absolute right-1.5 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Post comment"
          >
            {isSubmitting ? (
              <Loader size="xs" className="text-white" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentBox;