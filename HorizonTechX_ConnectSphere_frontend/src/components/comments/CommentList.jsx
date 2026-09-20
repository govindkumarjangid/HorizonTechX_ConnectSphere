import React from 'react';
import CommentItem from './CommentItem';
import CommentBox from './CommentBox';

export const CommentList = ({
  comments = [],
  postId,
  onAddComment,
  onLikeComment,
}) => {
  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={(commentId) => onLikeComment?.(postId, commentId)}
            />
          ))}
        </div>
      )}

      {/* Write Comment Box */}
      <CommentBox
        onSubmit={(user, text) => onAddComment?.(postId, user, text)}
      />
    </div>
  );
};

export default CommentList;