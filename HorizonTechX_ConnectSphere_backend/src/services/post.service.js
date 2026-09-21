import ApiError from '../utils/ApiError.js';
import { Post, Like, Comment, User, Follow } from '../models/index.js';
import { emitNotification } from '../socket.js';

const AUTHOR_FIELDS = 'username avatar';

const createPost = async (userId, { content }) => {
  const trimmed = String(content || '').trim();
  if (!trimmed) throw ApiError.badRequest('Post content is required');

  const post = await Post.create({
    author: userId,
    content: trimmed,
  });

  await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

  const populated = await Post.findById(post._id)
    .populate('author', AUTHOR_FIELDS)
    .lean();

  return { ...populated, isLiked: false };
};

const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  if (String(post.author) !== String(userId)) {
    throw ApiError.forbidden('You can only delete your own posts');
  }

  await Post.findByIdAndDelete(postId);

  await Promise.all([
    Comment.deleteMany({ post: postId }),
    Like.deleteMany({ post: postId }),
    User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } }),
  ]);
};

const getFeed = async (userId, { skip = 0, limit = 10 }) => {
  const followingIds = await Follow.find({ follower: userId }).distinct('following');

  // If user follows people, prioritize followed + own posts; otherwise show recent posts
  const filter =
    followingIds.length > 0
      ? { author: { $in: [...followingIds, userId] } }
      : {};

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter),
  ]);

  const postIds = posts.map((p) => p._id);
  const likedPostIds = new Set(
    (
      await Like.find({ user: userId, post: { $in: postIds } }).distinct('post')
    ).map(String)
  );

  const items = posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.has(String(post._id)),
  }));

  return {
    items,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      hasMore: skip + posts.length < total,
    },
  };
};

const getUserPosts = async (username, currentUserId, { skip = 0, limit = 10 }) => {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw ApiError.notFound('User not found');

  const [posts, total] = await Promise.all([
    Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments({ author: user._id }),
  ]);

  const postIds = posts.map((p) => p._id);
  const likedPostIds = new Set(
    (
      await Like.find({ user: currentUserId, post: { $in: postIds } }).distinct('post')
    ).map(String)
  );

  const items = posts.map((post) => ({
    ...post,
    isLiked: likedPostIds.has(String(post._id)),
  }));

  return {
    items,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      hasMore: skip + posts.length < total,
    },
  };
};

const toggleLike = async (postId, currentUser) => {
  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  const existing = await Like.findOne({ user: currentUser._id, post: postId });

  if (existing) {
    await Like.findByIdAndDelete(existing._id);
    const updated = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: -1 } },
      { new: true }
    );
    return {
      isLiked: false,
      likesCount: Math.max(0, updated.likesCount),
    };
  }

  await Like.create({ user: currentUser._id, post: postId });
  const updated = await Post.findByIdAndUpdate(
    postId,
    { $inc: { likesCount: 1 } },
    { new: true }
  );

  // Trigger real-time notification to post author
  emitNotification(post.author, {
    type: 'like',
    fromUser: {
      id: currentUser._id,
      username: currentUser.username,
      avatar: currentUser.avatar,
    },
    postId: post._id,
    createdAt: new Date().toISOString(),
  });

  return {
    isLiked: true,
    likesCount: updated.likesCount,
  };
};

export default {
  createPost,
  deletePost,
  getFeed,
  getUserPosts,
  toggleLike,
};