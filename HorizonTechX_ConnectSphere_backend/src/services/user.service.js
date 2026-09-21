import ApiError from '../utils/ApiError.js';
import { User, Follow } from '../models/index.js';

const PUBLIC_FIELDS = 'username bio avatar followersCount followingCount postsCount createdAt';

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

const updateProfile = async (userId, { username, bio, avatar }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

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

  if (avatar !== undefined) {
    user.avatar = avatar.trim();
  }

  await user.save();
  return user.toJSON();
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