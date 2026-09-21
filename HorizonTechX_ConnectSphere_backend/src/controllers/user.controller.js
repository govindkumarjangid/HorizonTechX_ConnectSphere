import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import userService from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.params.username, req.user._id);
  new ApiResponse(200, 'Profile fetched successfully', profile).send(res);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  new ApiResponse(200, 'Profile updated successfully', user).send(res);
});

export const getSuggestions = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20);
  const users = await userService.getSuggestions(req.user._id, limit);
  new ApiResponse(200, 'Suggestions fetched successfully', users).send(res);
});