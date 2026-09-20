import Follow from '../models/Follow.model.js';

const USER_FIELDS = 'username fullName bio avatar';

const followRepository = {
  // throws a duplicate key error (code 11000) if the pair already exists
  create(followerId, followingId) {
    return Follow.create({ follower: followerId, following: followingId });
  },

  // returns the deleted document, or null if there was nothing to delete
  remove(followerId, followingId) {
    return Follow.findOneAndDelete({ follower: followerId, following: followingId }).lean();
  },

  exists(followerId, followingId) {
    return Follow.exists({ follower: followerId, following: followingId });
  },

  // ids of everyone this user follows
  findFollowingIds(userId) {
    return Follow.distinct('following', { follower: userId });
  },

  // which of these users does followerId follow? (for the follow buttons in lists)
  findFollowedAmong(followerId, userIds) {
    return Follow.distinct('following', { follower: followerId, following: { $in: userIds } });
  },

  findFollowers(userId, { skip, limit }) {
    return Follow.find({ following: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('follower', USER_FIELDS)
      .lean();
  },

  findFollowing(userId, { skip, limit }) {
    return Follow.find({ follower: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('following', USER_FIELDS)
      .lean();
  },
};

export default followRepository;