import React, { useEffect, useCallback } from 'react';
import useCommentStore from '../../store/useCommentStore';
import CommentItem from './CommentItem';
import CommentBox from './CommentBox';
import Loader from '../common/Loader';

const EMPTY_COMMENTS = [];

export const CommentList = ({ postId, postAuthorId }) => {
  const comments = useCommentStore(
    useCallback((state) => state.commentsByPost[postId] || EMPTY_COMMENTS, [postId])
  );
  const isLoading = useCommentStore(
    useCallback((state) => Boolean(state.loadingByPost[postId]), [postId])
  );
  const isSubmitting = useCommentStore(
    useCallback((state) => Boolean(state.postingByPost[postId]), [postId])
  );
  const fetchComments = useCommentStore((state) => state.fetchComments);
  const addComment = useCommentStore((state) => state.addComment);
  const deleteComment = useCommentStore((state) => state.deleteComment);

  useEffect(() => {
    if (postId) fetchComments(postId);
  }, [postId, fetchComments]);

  const handleAddComment = useCallback(
    async (text) => await addComment(postId, text),
    [postId, addComment]
  );

  const handleDeleteComment = useCallback(
    async (commentId) => await deleteComment(postId, commentId),
    [postId, deleteComment]
  );

  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
      {/* Write Comment Box */}
      <CommentBox onSubmit={handleAddComment} isSubmitting={isSubmitting} />

      {/* Loading state */}
      {isLoading ? (
        <div className="py-4 flex justify-center">
          <Loader size="sm" />
        </div>
      ) : (
        /* Existing Comments */
        comments.length > 0 && (
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postAuthorId={postAuthorId}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default CommentList;