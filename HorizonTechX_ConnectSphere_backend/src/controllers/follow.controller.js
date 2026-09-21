import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/pagination.js';
import followService from '../services/follow.service.js';

export const follow = asyncHandler(async (req, res) => {
  const result = await followService.follow(req.user, req.params.userId);
  new ApiResponse(200, 'User followed successfully', result).send(res);
});

export const unfollow = asyncHandler(async (req, res) => {
  const result = await followService.unfollow(req.user._id, req.params.userId);
  new ApiResponse(200, 'User unfollowed successfully', result).send(res);
});

export const getFollowers = asyncHandler(async (req, res) => {
  const data = await followService.getFollowers(
    req.params.username,
    req.user._id,
    getPagination(req.query)
  );
  new ApiResponse(200, 'Followers fetched successfully', data).send(res);
});

export const getFollowing = asyncHandler(async (req, res) => {
  const data = await followService.getFollowing(
    req.params.username,
    req.user._id,
    getPagination(req.query)
  );
  new ApiResponse(200, 'Following fetched successfully', data).send(res);
});