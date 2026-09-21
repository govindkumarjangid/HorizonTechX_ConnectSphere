import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/generateToken.js';
import userRepository from '../repositories/user.repository.js';

// cookie is used by the React app, the Bearer header makes Postman testing easy
const getToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);

  return req.cookies?.accessToken;
};

export const protect = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (!token) throw ApiError.unauthorized('Authentication required');

  const decoded = verifyAccessToken(token);

  const user = await userRepository.findByIdForAuth(decoded._id);
  if (!user || !user.isActive)
    throw ApiError.unauthorized('User no longer exists or is deactivated');

  if (user.changedPasswordAfter(decoded.iat))
    throw ApiError.unauthorized('Password was changed, please log in again');

  req.user = user;
  next();
});