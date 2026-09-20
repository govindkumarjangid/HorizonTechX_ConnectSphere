import ApiError from '../utils/ApiError.js';
import { buildPage } from '../utils/pagination.js';
import { uploadImage, deleteImage } from '../config/cloudinary.config.js';
import postRepository from '../repositories/post.repository.js';
import commentRepository from '../repositories/comment.repository.js';
import userRepository from '../repositories/user.repository.js';
import followRepository from '../repositories/follow.repository.js';

const isSameId = (a, b) => String(a) === String(b);

// the likes array (all user ids) stays on the server, the client only gets isLiked
const toPostResponse = (post, userId) => {
  const { likes = [], ...rest } = post;
  return { ...rest, isLiked: likes.some((id) => isSameId(id, userId)) };
};

const toPage = (rows, pagination, userId) => {
  const page = buildPage(rows, pagination);
  return { ...page, items: page.items.map((post) => toPostResponse(post, userId)) };
};

const findPostOrFail = async (postId) => {
  const post = await postRepository.findById(postId);
  if (!post) throw ApiError.notFound('Post not found');
  return post;
};

const createPost = async (userId, body, file) => {
  const content = String(body.content ?? '').trim();
  if (!content && !file) throw ApiError.badRequest('Post must have text or an image');

  const image = file ? await uploadImage(file.buffer, 'post') : undefined;

  let post;
  try {
    post = await postRepository.create({ author: userId, content, image });
  } catch (error) {
    // do not leave an unused image behind
    if (image) await deleteImage(image.publicId);
    throw error;
  }

  await userRepository.incrementCounter(userId, 'postsCount', 1);

  return toPostResponse(await postRepository.findById(post._id), userId);
};

const getPost = async (postId, userId) => {
  const post = await findPostOrFail(postId);
  return toPostResponse(post, userId);
};

const updatePost = async (postId, userId, { content }) => {
  const post = await findPostOrFail(postId);

  if (!isSameId(post.author?._id, userId)) {
    throw ApiError.forbidden('You can only edit your own posts');
  }

  const updatedPost = await postRepository.updateContent(postId, content);
  return toPostResponse(updatedPost, userId);
};

const deletePost = async (postId, userId) => {
  const post = await findPostOrFail(postId);

  if (!isSameId(post.author?._id, userId)) {
    throw ApiError.forbidden('You can only delete your own posts');
  }

  await postRepository.deleteById(postId);

  // cleanup that can run side by side
  await Promise.all([
    commentRepository.deleteByPost(postId),
    userRepository.incrementCounter(userId, 'postsCount', -1),
    deleteImage(post.image?.publicId),
  ]);
};

// posts from people the user follows plus the user's own posts
const getFeed = async (userId, pagination) => {
  const followingIds = await followRepository.findFollowingIds(userId);
  const { skip, limit } = pagination;

  const rows = await postRepository.findByAuthorIds([...followingIds, userId], {
    skip,
    limit: limit + 1,
  });

  return toPage(rows, pagination, userId);
};

const getUserPosts = async (username, userId, pagination) => {
  const user = await userRepository.findPublicByUsername(username.toLowerCase());
  if (!user) throw ApiError.notFound('User not found');

  const { skip, limit } = pagination;
  const rows = await postRepository.findByAuthorIds([user._id], { skip, limit: limit + 1 });

  return toPage(rows, pagination, userId);
};

// like if not liked yet, otherwise unlike
const toggleLike = async (postId, userId) => {
  const liked = await postRepository.addLike(postId, userId);
  if (liked) return { isLiked: true, likesCount: liked.likesCount };

  const unliked = await postRepository.removeLike(postId, userId);
  if (unliked) return { isLiked: false, likesCount: unliked.likesCount };

  // neither worked, so the post does not exist
  throw ApiError.notFound('Post not found');
};

export default {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getFeed,
  getUserPosts,
  toggleLike,
};