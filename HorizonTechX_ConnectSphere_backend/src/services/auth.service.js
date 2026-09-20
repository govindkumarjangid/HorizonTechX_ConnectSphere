import ApiError from '../utils/ApiError.js';
import { generateTokens, verifyRefreshToken, hashToken } from '../utils/generateToken.js';
import userRepository from '../repositories/user.repository.js';

// creates a new token pair and stores the hash of the refresh token
const issueTokens = async (userId) => {
  const tokens = generateTokens(userId);
  await userRepository.saveRefreshToken(userId, hashToken(tokens.refreshToken));
  return tokens;
};

const register = async ({ username, email, password, fullName }) => {
  const [emailTaken, usernameTaken] = await Promise.all([
    userRepository.existsByEmail(email),
    userRepository.existsByUsername(username),
  ]);

  if (emailTaken) throw ApiError.conflict('Email is already registered');
  if (usernameTaken) throw ApiError.conflict('Username is already taken');

  // only these fields are passed on, so nobody can set role or counters from the request
  const user = await userRepository.create({ username, email, password, fullName });
  const tokens = await issueTokens(user._id);

  return { user, tokens };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmailWithPassword(email);
  const passwordMatches = user ? await user.comparePassword(password) : false;

  // same message for wrong email and wrong password
  if (!passwordMatches) throw ApiError.unauthorized('Invalid email or password');
  if (!user.isActive) throw ApiError.forbidden('This account is deactivated');

  await userRepository.markLogin(user._id);
  const tokens = await issueTokens(user._id);

  return { user, tokens };
};

// refresh token rotation: every refresh gives a new token and kills the old one
const refresh = async (refreshToken) => {
  if (!refreshToken) throw ApiError.unauthorized('Refresh token missing');

  const decoded = verifyRefreshToken(refreshToken);
  const user = await userRepository.findByIdWithRefreshToken(decoded._id);

  if (!user || !user.isActive) throw ApiError.unauthorized('Invalid refresh token');

  if (user.refreshToken !== hashToken(refreshToken)) {
    // an old token is being used again: treat it as stolen and end the session
    await userRepository.saveRefreshToken(user._id, null);
    throw ApiError.unauthorized('Refresh token is no longer valid, please log in again');
  }

  return issueTokens(user._id);
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    // expired or invalid token, nothing to revoke
    return;
  }

  await userRepository.saveRefreshToken(decoded._id, null);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepository.findByIdWithPassword(userId);
  if (!user) throw ApiError.unauthorized('User no longer exists');

  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect');
  }
  if (currentPassword === newPassword) {
    throw ApiError.badRequest('New password must be different from the current password');
  }

  // the model hook hashes it, clears the old refresh token and sets passwordChangedAt
  await userRepository.savePassword(user, newPassword);

  // old access tokens are now rejected, so give this device a fresh pair
  return issueTokens(user._id);
};

export default { register, login, refresh, logout, changePassword };