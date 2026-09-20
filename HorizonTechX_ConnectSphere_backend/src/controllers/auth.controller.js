import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { setAuthCookies, clearAuthCookies } from '../utils/generateToken.js';
import authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);

  setAuthCookies(res, tokens);
  new ApiResponse(201, 'Account created successfully', user).send(res);
});

export const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.login(req.body);

  setAuthCookies(res, tokens);
  new ApiResponse(200, 'Logged in successfully', user).send(res);
});

export const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refresh(req.cookies?.refreshToken);

  setAuthCookies(res, tokens);
  new ApiResponse(200, 'Token refreshed').send(res);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies?.refreshToken);

  clearAuthCookies(res);
  new ApiResponse(200, 'Logged out successfully').send(res);
});

export const getMe = asyncHandler(async (req, res) => {
  new ApiResponse(200, 'Current user', req.user).send(res);
});

export const changePassword = asyncHandler(async (req, res) => {
  const tokens = await authService.changePassword(req.user._id, req.body);

  setAuthCookies(res, tokens);
  new ApiResponse(200, 'Password changed successfully').send(res);
});