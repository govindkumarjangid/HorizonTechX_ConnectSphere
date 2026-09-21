import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/generateToken.js';
import { User } from '../models/index.js';

const getToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  return req.cookies?.accessToken;
};

export const protect = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (!token) throw ApiError.unauthorized('Authentication required');

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  req.user = user;
  next();
});