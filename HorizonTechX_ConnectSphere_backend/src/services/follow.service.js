import ApiError from '../utils/ApiError.js';
import { Follow, User } from '../models/index.js';
import { emitNotification, emitFollowUpdated } from '../socket.js';

const USER_FIELDS = 'username bio avatar followersCount followingCount';

const follow = async (currentUser, targetUserId) => {
  if (String(currentUser._id) === String(targetUserId)) {
    throw ApiError.badRequest('You cannot follow yourself');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw ApiError.notFound('User not found');

  const existing = await Follow.findOne({
    follower: currentUser._id,
    following: targetUserId,
  });

  if (existing) {
    throw ApiError.conflict('You already follow this user');
  }

  await Follow.create({
    follower: currentUser._id,
    following: targetUserId,
  });

  const [updatedTarget, updatedCurrent] = await Promise.all([
    User.findByIdAndUpdate(
      targetUserId,
      { $inc: { followersCount: 1 } },
      { returnDocument: 'after' }
    ),
    User.findByIdAndUpdate(
      currentUser._id,
      { $inc: { followingCount: 1 } },
      { returnDocument: 'after' }
    ),
  ]);

  // Broadcast real-time follow stats update
  emitFollowUpdated(
    targetUserId,
    updatedTarget.followersCount,
    currentUser._id,
    updatedCurrent.followingCount
  );

  // Trigger real-time notification to target user
  emitNotification(targetUserId, {
    type: 'follow',
    fromUser: {
      id: currentUser._id,
      username: currentUser.username,
      avatar: currentUser.avatar,
    },
    createdAt: new Date().toISOString(),
  });

  return {
    isFollowing: true,
    followersCount: updatedTarget.followersCount,
  };
};

const unfollow = async (currentUserId, targetUserId) => {
  const removed = await Follow.findOneAndDelete({
    follower: currentUserId,
    following: targetUserId,
  });

  if (!removed) {
    throw ApiError.badRequest('You are not following this user');
  }

  const [updatedTarget, updatedCurrent] = await Promise.all([
    User.findByIdAndUpdate(
      targetUserId,
      { $inc: { followersCount: -1 } },
      { returnDocument: 'after' }
    ),
    User.findByIdAndUpdate(
      currentUserId,
      { $inc: { followingCount: -1 } },
      { returnDocument: 'after' }
    ),
  ]);

  const finalFollowers = Math.max(0, updatedTarget?.followersCount || 0);
  const finalFollowing = Math.max(0, updatedCurrent?.followingCount || 0);

  // Broadcast real-time unfollow stats update
  emitFollowUpdated(targetUserId, finalFollowers, currentUserId, finalFollowing);

  return {
    isFollowing: false,
    followersCount: finalFollowers,
  };
};

const getFollowers = async (username, currentUserId, { skip = 0, limit = 20 }) => {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw ApiError.notFound('User not found');

  const [follows, total] = await Promise.all([
    Follow.find({ following: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('follower', USER_FIELDS)
      .lean(),
    Follow.countDocuments({ following: user._id }),
  ]);

  const followerIds = follows.map((f) => f.follower?._id).filter(Boolean);
  const myFollowings = new Set(
    (
      await Follow.find({
        follower: currentUserId,
        following: { $in: followerIds },
      }).distinct('following')
    ).map(String)
  );

  const items = follows
    .filter((f) => f.follower)
    .map((f) => ({
      ...f.follower,
      isFollowing: myFollowings.has(String(f.follower._id)),
      isSelf: String(f.follower._id) === String(currentUserId),
    }));

  return {
    items,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      hasMore: skip + items.length < total,
    },
  };
};

const getFollowing = async (username, currentUserId, { skip = 0, limit = 20 }) => {
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw ApiError.notFound('User not found');

  const [follows, total] = await Promise.all([
    Follow.find({ follower: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('following', USER_FIELDS)
      .lean(),
    Follow.countDocuments({ follower: user._id }),
  ]);

  const followingIds = follows.map((f) => f.following?._id).filter(Boolean);
  const myFollowings = new Set(
    (
      await Follow.find({
        follower: currentUserId,
        following: { $in: followingIds },
      }).distinct('following')
    ).map(String)
  );

  const items = follows
    .filter((f) => f.following)
    .map((f) => ({
      ...f.following,
      isFollowing: myFollowings.has(String(f.following._id)),
      isSelf: String(f.following._id) === String(currentUserId),
    }));

  return {
    items,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      hasMore: skip + items.length < total,
    },
  };
};

export default {
  follow,
  unfollow,
  getFollowers,
  getFollowing,
};