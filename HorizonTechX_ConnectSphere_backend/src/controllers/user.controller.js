import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/pagination.js';
import userService from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.params.username, req.user._id);

  new ApiResponse(200, 'Profile fetched', profile).send(res);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);

  new ApiResponse(200, 'Profile updated', user).send(res);
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const user = await userService.updateAvatar(req.user._id, req.file);

  new ApiResponse(200, 'Avatar updated', user).send(res);
});

export const searchUsers = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const data = await userService.searchUsers(String(req.query.q ?? ''), pagination);

  new ApiResponse(200, 'Users fetched', data).send(res);
});

export const getSuggestions = asyncHandler(async (req, res) => {
  const { limit } = getPagination(req.query, { defaultLimit: 5, maxLimit: 20 });
  const users = await userService.getSuggestions(req.user._id, limit);

  new ApiResponse(200, 'Suggestions fetched', users).send(res);
});