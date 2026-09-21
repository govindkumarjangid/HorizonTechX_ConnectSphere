import ApiError from '../utils/ApiError.js';
import { generateAccessToken } from '../utils/generateToken.js';
import { User } from '../models/index.js';

const register = async ({ username, password, bio = '', avatar = '' }) => {
  const normalizedUsername = username.trim().toLowerCase();

  const existing = await User.findOne({ username: normalizedUsername });
  if (existing) {
    throw ApiError.conflict('Username is already taken');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    username: normalizedUsername,
    passwordHash,
    bio: bio.trim(),
    avatar: avatar.trim(),
  });

  const token = generateAccessToken(user._id);
  return { user, token };
};

const login = async ({ username, password }) => {
  const normalizedUsername = username.trim().toLowerCase();

  const user = await User.findOne({ username: normalizedUsername }).select('+passwordHash');
  if (!user) {
    throw ApiError.unauthorized('Invalid username or password');
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    throw ApiError.unauthorized('Invalid username or password');
  }

  const token = generateAccessToken(user._id);
  const userObj = user.toJSON();
  return { user: userObj, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

export default { register, login, getMe };