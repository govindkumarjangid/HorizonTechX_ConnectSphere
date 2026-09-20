import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MoreHorizontal,
  MessageCircle,
  Repeat,
  Bookmark,
  Send,
  CheckCircle,
  Trash2,
  Copy,
} from 'lucide-react';
import Avatar from '../users/Avatar';
import LikeButton from './LikeButton';
import CommentList from '../comments/CommentList';
import ConfirmModal from '../common/ConfirmModal';
import { useAuth } from '../../store/useAuthStore';
import { usePostStore } from '../../store/usePostStore';

const PostCardComponent = ({ post, priority = false }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toggleLike, toggleBookmark, deletePost, addComment, toggleCommentLike, showToast } =
    usePostStore();

  const [showComments, setShowComments] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const isAuthor =
    post.author?.id === currentUser?.id ||
    post.author?.username === currentUser?.username;

  // Render text with interactive hashtags and mentions
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const words = content.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith('#')) {
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/search?q=${encodeURIComponent(word)}`);
            }}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
          >
            {word}
          </span>
        );
      }
      if (word.startsWith('@')) {
        const username = word.replace('@', '');
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${username}`);
            }}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`);
    showToast('Link copied to clipboard');
    setIsMenuOpen(false);
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs mb-4 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700/80">
      {/* Post Header matching Screenshot 1 & 4 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={post.author?.avatar}
            alt={post.author?.fullName}
            size="md"
            onClick={() => navigate(`/profile/${post.author?.username}`)}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/profile/${post.author?.username}`}
                className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate"
              >
                {post.author?.fullName}
              </Link>
              {post.author?.isVerified && (
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500 dark:fill-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
              {post.timestamp}
            </p>
          </div>
        </div>

        {/* Post Context Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  toggleBookmark(post.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{post.isBookmarked ? 'Remove Bookmark' : 'Save Post'}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>
              {isAuthor && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-medium border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-3.5">
        {renderFormattedContent(post.content)}
      </div>

      {/* Post Media Grid matching Screenshot 1 & 4 */}
      {/* Post Video Playback */}
      {post.video && (
        <div className="mb-3.5 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
          <video
            src={post.video}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      )}

      {/* Post Media Grid matching Screenshot 1 & 4 */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3.5 rounded-xl overflow-hidden">
          {post.images.length === 1 ? (
            <img
              src={post.images[0]}
              alt="Post media"
              onClick={() => setSelectedImageModal(post.images[0])}
              className="w-full max-h-[480px] object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
            />
          ) : post.images.length === 2 ? (
            <div className="grid grid-cols-2 gap-2">
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Post media"
                  onClick={() => setSelectedImageModal(img)}
                  className="w-full h-64 object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            /* 3+ images responsive layout: lead header on mobile, 3-column on desktop */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:h-72">
              <div className="col-span-2 sm:col-span-1 h-44 sm:h-full">
                <img
                  src={post.images[0]}
                  alt="Post media 1"
                  onClick={() => setSelectedImageModal(post.images[0])}
                  className="w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                  loading={priority ? 'eager' : 'lazy'}
                />
              </div>
              <div className="col-span-1 h-24 sm:h-full">
                <img
                  src={post.images[1]}
                  alt="Post media 2"
                  onClick={() => setSelectedImageModal(post.images[1])}
                  className="w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                  loading="lazy"
                />
              </div>
              <div
                className="col-span-1 h-24 sm:h-full relative cursor-pointer group"
                onClick={() => setSelectedImageModal(post.images[2])}
              >
                <img
                  src={post.images[2]}
                  alt="Post media 3"
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
                {post.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-xl group-hover:bg-black/60 transition-colors">
                    +{post.images.length - 2}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Bar matching Screenshot 1 */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Like Button */}
          <LikeButton
            isLiked={post.isLiked}
            likesCount={post.likesCount}
            onToggle={() => toggleLike(post.id)}
          />

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1"
          >
            <MessageCircle className="w-4 h-4 stroke-[2]" />
            <span>{post.commentsCount || 0}</span>
          </button>

          {/* Repost Button */}
          <button
            onClick={() => {
              showToast('Post shared to your network');
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer py-1"
          >
            <Repeat className="w-4 h-4 stroke-[2]" />
            {post.sharesCount ? <span>{post.sharesCount}</span> : null}
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(post.id)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              post.isBookmarked
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Save post"
            aria-label="Bookmark post"
          >
            <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-blue-600' : 'stroke-[2]'}`} />
          </button>

          {/* Direct Send Icon */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Share"
            aria-label="Share post"
          >
            <Send className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Inline Comments Section */}
      {showComments && (
        <div className="mt-3">
          <CommentList
            postId={post.id}
            comments={post.comments || []}
            onAddComment={addComment}
            onLikeComment={toggleCommentLike}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deletePost(post.id)}
        title="Delete Post"
        message="Are you sure you want to permanently delete this post?"
        confirmText="Delete"
      />

      {/* Media Lightbox */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <img
            src={selectedImageModal}
            alt="Full size media"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </article>
  );
};

export const PostCard = React.memo(PostCardComponent);
export default PostCard;