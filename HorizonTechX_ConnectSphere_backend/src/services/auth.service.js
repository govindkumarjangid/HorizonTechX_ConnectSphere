import ApiError from '../utils/ApiError.js';
import { generateAccessToken } from '../utils/generateToken.js';
import { User } from '../models/index.js';

const register = async ({ fullName = '', username, email = null, password, bio = '', avatar = '' }) => {
  const normalizedUsername = username.trim().toLowerCase();

  const existingUsername = await User.findOne({ username: normalizedUsername });
  if (existingUsername) {
    throw ApiError.conflict('Username is already taken');
  }

  let normalizedEmail = null;
  if (email && typeof email === 'string' && email.trim()) {
    normalizedEmail = email.trim().toLowerCase();
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      throw ApiError.conflict('Email is already registered');
    }
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    fullName: fullName.trim(),
    username: normalizedUsername,
    email: normalizedEmail || undefined,
    passwordHash,
    bio: bio.trim(),
    avatar: avatar.trim(),
  });

  const token = generateAccessToken(user._id);
  return { user, token };
};

const login = async ({ identifier, username, email, password }) => {
  const loginId = (identifier || username || email || '').trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ username: loginId }, { email: loginId }],
  }).select('+passwordHash');

  if (!user) {
    throw ApiError.unauthorized('Invalid username/email or password');
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    throw ApiError.unauthorized('Invalid username/email or password');
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