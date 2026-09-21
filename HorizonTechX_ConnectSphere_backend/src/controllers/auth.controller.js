import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  new ApiResponse(201, 'Account created successfully', result).send(res);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  new ApiResponse(200, 'Logged in successfully', result).send(res);
});

export const logout = asyncHandler(async (_req, res) => {
  new ApiResponse(200, 'Logged out successfully').send(res);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  new ApiResponse(200, 'Current user', user).send(res);
});