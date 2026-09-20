import ApiError from '../utils/ApiError.js';
import { buildPage } from '../utils/pagination.js';
import followRepository from '../repositories/follow.repository.js';
import userRepository from '../repositories/user.repository.js';

const DUPLICATE_KEY_CODE = 11000;

const isSameId = (a, b) => String(a) === String(b);

const follow = async (currentUserId, targetUserId) => {
  if (isSameId(currentUserId, targetUserId)) {
    throw ApiError.badRequest('You cannot follow yourself');
  }

  const target = await userRepository.findPublicById(targetUserId);
  if (!target) throw ApiError.notFound('User not found');

  try {
    await followRepository.create(currentUserId, target._id);
  } catch (error) {
    // the unique index blocks double clicks and parallel requests
    if (error.code === DUPLICATE_KEY_CODE) throw ApiError.conflict('You already follow this user');
    throw error;
  }

  const [updatedTarget] = await Promise.all([
    userRepository.incrementCounter(target._id, 'followersCount', 1),
    userRepository.incrementCounter(currentUserId, 'followingCount', 1),
  ]);

  return { isFollowing: true, followersCount: updatedTarget.followersCount };
};

const unfollow = async (currentUserId, targetUserId) => {
  const removed = await followRepository.remove(currentUserId, targetUserId);
  if (!removed) throw ApiError.badRequest('You are not following this user');

  const [updatedTarget] = await Promise.all([
    userRepository.incrementCounter(targetUserId, 'followersCount', -1),
    userRepository.incrementCounter(currentUserId, 'followingCount', -1),
  ]);

  return { isFollowing: false, followersCount: updatedTarget?.followersCount ?? 0 };
};

// adds isFollowing / isCurrentUser so the list can show the right button
const markFollowState = async (users, currentUserId) => {
  const followedIds = await followRepository.findFollowedAmong(
    currentUserId,
    users.map((user) => user._id)
  );
  const followedSet = new Set(followedIds.map(String));

  return users.map((user) => ({
    ...user,
    isFollowing: followedSet.has(String(user._id)),
    isCurrentUser: isSameId(user._id, currentUserId),
  }));
};

const listConnections = async ({ username, currentUserId, pagination, find, pick }) => {
  const user = await userRepository.findPublicByUsername(username.toLowerCase());
  if (!user) throw ApiError.notFound('User not found');

  const { skip, limit } = pagination;
  const rows = await find(user._id, { skip, limit: limit + 1 });
  const page = buildPage(rows, pagination);

  // a populated user can be null if the account was removed
  const users = page.items.map(pick).filter(Boolean);

  return { ...page, items: await markFollowState(users, currentUserId) };
};

const getFollowers = (username, currentUserId, pagination) =>
  listConnections({
    username,
    currentUserId,
    pagination,
    find: followRepository.findFollowers,
    pick: (row) => row.follower,
  });

const getFollowing = (username, currentUserId, pagination) =>
  listConnections({
    username,
    currentUserId,
    pagination,
    find: followRepository.findFollowing,
    pick: (row) => row.following,
  });

export default { follow, unfollow, getFollowers, getFollowing };