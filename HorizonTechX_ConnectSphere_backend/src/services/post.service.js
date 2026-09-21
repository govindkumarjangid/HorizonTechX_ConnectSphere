import ApiError from '../utils/ApiError.js';
import { Post, Like, Comment, User, Follow } from '../models/index.js';
import {
  emitNotification,
  emitPostCreated,
  emitPostDeleted,
  emitPostLikeUpdated,
  emitPostUpdated,
} from '../socket.js';
import { uploadMedia, deleteMedia } from '../configs/cloudinary.config.js';

const AUTHOR_FIELDS = 'username avatar fullName';

const createPost = async (userId, { content = '' } = {}, file = null) => {
  const trimmed = String(content || '').trim();

  let media = null;
  if (file && file.buffer) {
    const uploaded = await uploadMedia(file.buffer, {
      type: 'post',
      mimetype: file.mimetype,
    });
    media = {
      url: uploaded.url,
      publicId: uploaded.publicId,
      mediaType: uploaded.mediaType,
    };
  }

  if (!trimmed && !media) {
    throw ApiError.badRequest('Post must contain text content or media');
  }

  const post = await Post.create({
    author: userId,
    content: trimmed,
    media: media || undefined,
  });

  await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

  const populated = await Post.findById(post._id)
    .populate('author', AUTHOR_FIELDS)
    .lean();

  const result = { ...populated, isLiked: false };
  emitPostCreated(result);
  return result;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  if (String(post.author) !== String(userId)) {
    throw ApiError.forbidden('You can only delete your own posts');
  }

  if (post.media?.publicId) {
    deleteMedia(post.media.publicId, post.media.mediaType).catch((err) => {
      console.error('Failed to delete post media from Cloudinary:', err?.message);
    });
  }

  await Post.findByIdAndDelete(postId);
  emitPostDeleted(postId);

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
      { returnDocument: 'after' }
    );
    const finalCount = Math.max(0, updated.likesCount);
    emitPostLikeUpdated(postId, finalCount);
    return {
      isLiked: false,
      likesCount: finalCount,
    };
  }

  await Like.create({ user: currentUser._id, post: postId });
  const updated = await Post.findByIdAndUpdate(
    postId,
    { $inc: { likesCount: 1 } },
    { returnDocument: 'after' }
  );

  emitPostLikeUpdated(postId, updated.likesCount);

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

const updatePost = async (postId, userId, { content } = {}, file = null, removeMedia = false) => {
  const post = await Post.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');

  if (String(post.author) !== String(userId)) {
    throw ApiError.forbidden('You can only edit your own posts');
  }

  // If user requested to remove existing media or upload replacement
  if (removeMedia && post.media?.publicId) {
    deleteMedia(post.media.publicId, post.media.mediaType).catch((err) => {
      console.error('Failed to delete old post media from Cloudinary:', err?.message);
    });
    post.media = undefined;
  }

  if (file && file.buffer) {
    if (post.media?.publicId) {
      deleteMedia(post.media.publicId, post.media.mediaType).catch((err) => {
        console.error('Failed to delete replaced media from Cloudinary:', err?.message);
      });
    }

    const uploaded = await uploadMedia(file.buffer, {
      type: 'post',
      mimetype: file.mimetype,
    });
    post.media = {
      url: uploaded.url,
      publicId: uploaded.publicId,
      mediaType: uploaded.mediaType,
    };
  }

  if (content !== undefined) {
    post.content = String(content).trim();
  }

  if (!post.content && !post.media?.url) {
    throw ApiError.badRequest('Post cannot be empty without text or media');
  }

  await post.save();

  const populated = await Post.findById(post._id)
    .populate('author', AUTHOR_FIELDS)
    .lean();

  const isLiked = Boolean(await Like.exists({ user: userId, post: post._id }));
  const result = { ...populated, isLiked };

  emitPostUpdated(result);
  return result;
};

export default {
  createPost,
  updatePost,
  deletePost,
  getFeed,
  getUserPosts,
  toggleLike,
};