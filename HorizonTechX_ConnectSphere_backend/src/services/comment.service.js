import ApiError from '../utils/ApiError.js';
import { Comment, Post } from '../models/index.js';
import { emitNotification } from '../socket.js';

const AUTHOR_FIELDS = 'username avatar';

const addComment = async (postId, currentUser, { text }) => {
  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  const trimmed = String(text || '').trim();
  if (!trimmed) throw ApiError.badRequest('Comment cannot be empty');

  const comment = await Comment.create({
    post: postId,
    author: currentUser._id,
    text: trimmed,
  });

  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  const populated = await Comment.findById(comment._id)
    .populate('author', AUTHOR_FIELDS)
    .lean();

  // Trigger real-time notification to post author
  emitNotification(post.author, {
    type: 'comment',
    fromUser: {
      id: currentUser._id,
      username: currentUser.username,
      avatar: currentUser.avatar,
    },
    postId: post._id,
    createdAt: new Date().toISOString(),
  });

  return populated;
};

const getComments = async (postId, { skip = 0, limit = 20 }) => {
  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  const [comments, total] = await Promise.all([
    Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean(),
    Comment.countDocuments({ post: postId }),
  ]);

  return {
    items: comments,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      hasMore: skip + comments.length < total,
    },
  };
};

const deleteComment = async (postId, commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment || String(comment.post) !== String(postId)) {
    throw ApiError.notFound('Comment not found');
  }

  const post = await Post.findById(postId);
  const isCommentAuthor = String(comment.author) === String(userId);
  const isPostAuthor = post && String(post.author) === String(userId);

  if (!isCommentAuthor && !isPostAuthor) {
    throw ApiError.forbidden('You do not have permission to delete this comment');
  }

  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });
};

export default {
  addComment,
  getComments,
  deleteComment,
};