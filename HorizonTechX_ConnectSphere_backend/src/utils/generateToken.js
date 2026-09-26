import jwt from 'jsonwebtoken';
import env from '../configs/env.config.js';

const getAccessSecret = () => {
  const secret = env.jwt?.accessSecret;
  if (!secret)
    throw new Error('ACCESS_TOKEN_SECRET must be configured');
  return secret;
};

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { _id: String(userId) },
    getAccessSecret(),
    { expiresIn: env.jwt?.accessExpiresIn || '7d' }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, getAccessSecret());
};