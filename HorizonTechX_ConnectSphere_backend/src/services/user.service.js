import ApiError from '../utils/ApiError.js';
import { User, Follow } from '../models/index.js';
import { uploadMedia } from '../configs/cloudinary.config.js';
import { emitProfileUpdated } from '../socket.js';

const PUBLIC_FIELDS = 'fullName username bio avatar followersCount followingCount postsCount createdAt';

const getProfile = async (username, currentUserId) => {
  const user = await User.findOne({ username: username.toLowerCase() }).select(PUBLIC_FIELDS);
  if (!user) throw ApiError.notFound('User not found');

  const isOwnProfile = String(user._id) === String(currentUserId);
  const isFollowing = isOwnProfile
    ? false
    : Boolean(await Follow.exists({ follower: currentUserId, following: user._id }));

  return {
    ...user.toJSON(),
    isOwnProfile,
    isFollowing,
  };
};

const updateProfile = async (userId, { fullName, username, bio, avatar } = {}, file = null) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (file && file.buffer) {
    const uploaded = await uploadMedia(file.buffer, {
      type: 'avatar',
      mimetype: file.mimetype,
    });
    user.avatar = uploaded.url;
  } else if (avatar !== undefined) {
    user.avatar = avatar.trim();
  }

  if (fullName !== undefined) {
    user.fullName = fullName.trim();
  }

  if (username !== undefined) {
    const normalized = username.trim().toLowerCase();
    if (normalized !== user.username) {
      const existing = await User.findOne({ username: normalized });
      if (existing) {
        throw ApiError.conflict('Username is already taken');
      }
      user.username = normalized;
    }
  }

  if (bio !== undefined) {
    user.bio = bio.trim();
  }

  await user.save();
  const userJson = user.toJSON();
  emitProfileUpdated(userJson);
  return userJson;
};

const getSuggestions = async (currentUserId, limit = 5) => {
  const followingIds = await Follow.find({ follower: currentUserId }).distinct('following');
  const excludeIds = [...followingIds, currentUserId];

  const suggestions = await User.find({ _id: { $nin: excludeIds } })
    .select(PUBLIC_FIELDS)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return suggestions.map((u) => ({
    ...u,
    isFollowing: false,
  }));
};

export default {
  getProfile,
  updateProfile,
  getSuggestions,
};