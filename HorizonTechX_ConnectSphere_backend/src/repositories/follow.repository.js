import Follow from '../models/Follow.model.js';
import { USER_FIELDS } from "../constents.js"

const followRepository = {

  create(followerId, followingId) {
    return Follow.create({ follower: followerId, following: followingId });
  },


  remove(followerId, followingId) {
    return Follow.findOneAndDelete({ follower: followerId, following: followingId }).lean();
  },

  exists(followerId, followingId) {
    return Follow.exists({ follower: followerId, following: followingId });
  },


  findFollowingIds(userId) {
    return Follow.distinct('following', { follower: userId });
  },

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