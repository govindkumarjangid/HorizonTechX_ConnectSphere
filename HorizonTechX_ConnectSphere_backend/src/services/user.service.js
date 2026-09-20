import ApiError from '../utils/ApiError.js';
import { buildPage } from '../utils/pagination.js';
import { uploadImage, deleteImage } from '../config/cloudinary.config.js';
import userRepository from '../repositories/user.repository.js';
import followRepository from '../repositories/follow.repository.js';

const isSameId = (a, b) => String(a) === String(b);

const getProfile = async (username, currentUserId) => {
  const user = await userRepository.findPublicByUsername(username.toLowerCase());
  if (!user) throw ApiError.notFound('User not found');

  const isOwnProfile = isSameId(user._id, currentUserId);
  const isFollowing = isOwnProfile
    ? false
    : Boolean(await followRepository.exists(currentUserId, user._id));

  return { ...user, isOwnProfile, isFollowing };
};

const updateProfile = async (userId, { fullName, bio }) => {
  const changes = {};
  if (fullName !== undefined) changes.fullName = fullName;
  if (bio !== undefined) changes.bio = bio;

  return userRepository.updateProfile(userId, changes);
};

const updateAvatar = async (userId, file) => {
  if (!file) throw ApiError.badRequest('Avatar image is required');

  const user = await userRepository.findById(userId);
  const avatar = await uploadImage(file.buffer, 'avatar');

  let updatedUser;
  try {
    updatedUser = await userRepository.updateProfile(userId, { avatar });
  } catch (error) {
    // do not leave an unused image behind
    await deleteImage(avatar.publicId);
    throw error;
  }

  await deleteImage(user.avatar?.publicId);
  return updatedUser;
};

const searchUsers = async (text, pagination) => {
  const searchText = text.trim();
  if (!searchText) return buildPage([], pagination);

  const { skip, limit } = pagination;
  const rows = await userRepository.search(searchText, { skip, limit: limit + 1 });

  return buildPage(rows, pagination);
};

const getSuggestions = async (userId, limit = 5) => {
  const followingIds = await followRepository.findFollowingIds(userId);
  return userRepository.findSuggestions([...followingIds, userId], limit);
};

export default { getProfile, updateProfile, updateAvatar, searchUsers, getSuggestions };