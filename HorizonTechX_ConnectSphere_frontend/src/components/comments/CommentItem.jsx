import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Avatar from '../users/Avatar';
import { formatRelativeTime } from '../../utils/formatDate';
import useAuthStore from '../../store/useAuthStore';

export const CommentItem = ({ comment, postAuthorId, onDelete }) => {
  const currentUser = useAuthStore((state) => state.user);

  const isCommentAuthor =
    comment.author?._id === currentUser?._id ||
    comment.author?.username === currentUser?.username;
  const isPostAuthor = postAuthorId && String(postAuthorId) === String(currentUser?._id);
  const canDelete = isCommentAuthor || isPostAuthor;

  return (
    <div className="flex items-start gap-2.5 py-2 group">
      <Avatar
        src={comment.author?.avatar}
        alt={comment.author?.username}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-slate-100/80 dark:bg-slate-800/70 rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 inline-block max-w-full">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${comment.author?.username}`}
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
            >
              @{comment.author?.username}
            </Link>
            <span className="text-[10px] text-slate-400">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 break-words">
            {comment.text}
          </p>
        </div>

        {canDelete && (
          <div className="mt-0.5 ml-2">
            <button
              onClick={() => onDelete?.(comment._id)}
              className="text-[11px] text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
              title="Delete comment"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;