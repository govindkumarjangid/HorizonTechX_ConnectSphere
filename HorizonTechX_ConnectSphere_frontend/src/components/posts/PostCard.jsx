import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MoreHorizontal, MessageCircle, Trash2, Edit3, Share2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from '../users/Avatar';
import LikeButton from './LikeButton';
import FormattedText from './FormattedText';
import ErrorBoundary from '../common/ErrorBoundary';
import Loader from '../common/Loader';
import useToastStore from '../../store/useToastStore';

const CommentList = lazy(() => import('../comments/CommentList'));
const ConfirmModal = lazy(() => import('../common/ConfirmModal'));
const EditPostModal = lazy(() => import('./EditPostModal'));
import { formatRelativeTime } from '../../utils/formatDate';
import useAuthStore from '../../store/useAuthStore';
import usePostStore from '../../store/usePostStore';

const PostCardComponent = ({ post, onDelete }) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const toggleLike = usePostStore((state) => state.toggleLike);
  const deletePost = usePostStore((state) => state.deletePost);

  const [showComments, setShowComments] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  const isAuthor =
    post.author?._id === currentUser?._id ||
    post.author?.username === currentUser?.username;

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleToggleLike = async () => {
    await toggleLike(post._id);
  };

  const handleShare = async (e) => {
    e?.stopPropagation?.();
    setIsMenuOpen(false);
    const postUrl = `${window.location.origin}/?post=${post._id}`;
    const authorName = post.author?.fullName || `@${post.author?.username}` || 'User';
    const textSnippet = post.content ? post.content.slice(0, 100) : 'Check out this post on Connectly';

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${authorName} on Connectly`,
          text: textSnippet,
          url: postUrl,
        });
        useToastStore.getState().success('Post shared successfully!');
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = postUrl;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      useToastStore.getState().success('Post link copied to clipboard!');
    } catch {
      useToastStore.getState().error('Could not copy link');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deletePost(post._id);
    setIsDeleting(false);
    if (res.success) {
      setIsDeleteModalOpen(false);
      onDelete?.(post._id);
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs mb-2.5 sm:mb-4 transition-colors">
      {/* Post Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={post.author?.avatar}
            alt={post.author?.username}
            size="md"
            onClick={() => navigate(`/profile/${post.author?.username}`)}
          />
          <div className="min-w-0">
            <Link
              to={`/profile/${post.author?.username}`}
              className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
            >
              {post.author?.fullName || `@${post.author?.username}`}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <span>@{post.author?.username}</span>
              <span>•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Post Options Menu (Public to all for Share, plus Edit & Delete for author) */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -6 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                style={{ transformOrigin: 'top right' }}
                className="absolute right-0 top-full mt-1 w-38 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 overflow-hidden"
              >
                {/* Share Post (Public to everyone) */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-medium cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Share Post</span>
                </button>

                {isAuthor && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-medium cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-medium cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post</span>
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Text Content with @mentions and #hashtags */}
      {post.content && (
        <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-3">
          <FormattedText text={post.content} />
        </div>
      )}

      {/* Media Attachment (Image or Video from Cloudinary) */}
      {post.media?.url && (
        <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center">
          {post.media.mediaType === 'video' ? (
            <video
              src={post.media.url}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-95 sm:max-h-120 object-contain bg-black rounded-xl sm:rounded-2xl"
            />
          ) : (
            <img
              src={post.media.url}
              alt="Post attachment"
              loading="lazy"
              className="w-full max-h-100 sm:max-h-125 object-cover rounded-xl sm:rounded-2xl"
            />
          )}
        </div>
      )}

      {/* Action Bar (Like, Comments & Share) */}
      <div className="flex items-center gap-4 sm:gap-6 pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
        {/* Like Button */}
        <LikeButton
          isLiked={post.isLiked}
          likesCount={post.likesCount}
          onToggle={handleToggleLike}
        />

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1"
        >
          <MessageCircle className="w-4 h-4 stroke-2" />
          <span>{post.commentsCount || 0}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1"
          title="Share Post"
          aria-label="Share post"
        >
          <Share2 className="w-4 h-4 stroke-2" />
          <span>Share</span>
        </button>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="mt-3">
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex justify-center py-4">
                  <Loader size="sm" />
                </div>
              }
            >
              <CommentList
                postId={post._id}
                postAuthorId={post.author?._id}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      {/* Lazy-loaded Modals */}
      <Suspense fallback={null}>
        {isAuthor && isEditModalOpen && (
          <EditPostModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            post={post}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Post"
            message="Are you sure you want to delete this post? This action cannot be undone."
            confirmText={isDeleting ? 'Deleting...' : 'Delete'}
          />
        )}
      </Suspense>
    </article>
  );
};

export const PostCard = React.memo(PostCardComponent);
export default PostCard;