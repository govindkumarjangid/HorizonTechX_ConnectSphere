import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UNIT_MS } from "../constents.js"
import { env } from "../configs/env.config.js";

// "15m" -> s, m, h, d
const toMs = (value) => {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) throw new Error(`Invalid duration "${value}". Use values like 15m, 1h, 7d`);
  return Number(match[1]) * UNIT_MS[match[2]];
};

// env is read here (not at the top of the file) because dotenv may load after imports
const getConfig = () => {
  const accessSecret = env.accessSecret;
  const refreshSecret = env.refreshSecret;

  if (!accessSecret || !refreshSecret)
    throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set in .env');

  return {
    accessSecret,
    refreshSecret,
    accessExpiresIn: env.accessExpiresIn || '15m',
    refreshExpiresIn: env.refreshExpiresIn || '7d',
  };
};

export const generateAccessToken = (userId) => {
  const { accessSecret, accessExpiresIn } = getConfig();

  return jwt.sign(
    { _id: String(userId) },
    accessSecret,
    { expiresIn: accessExpiresIn }
  );
};


export const generateRefreshToken = (userId) => {
  const { refreshSecret, refreshExpiresIn } = getConfig();

  return jwt.sign(
    { _id: String(userId) },
    refreshSecret,
    {
      expiresIn: refreshExpiresIn,
      jwtid: crypto.randomUUID(),
    }
  );
};

export const generateTokens = (userId) => ({
  accessToken: generateAccessToken(userId),
  refreshToken: generateRefreshToken(userId),
});

// both throw JsonWebTokenError / TokenExpiredError, the error middleware maps them to 401
export const verifyAccessToken = (token) => jwt.verify(token, getConfig().accessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, getConfig().refreshSecret);

// only the hash of the refresh token is stored in the DB
export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const baseCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };
};

export const setAuthCookies = (res, { accessToken, refreshToken }) => {
  const { accessExpiresIn, refreshExpiresIn } = getConfig();

  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions(),
    maxAge: toMs(accessExpiresIn),
  });

  // refresh cookie is only sent to auth routes (refresh, logout)
  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions(),
    path: '/api/v1/auth',
    maxAge: toMs(refreshExpiresIn),
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', baseCookieOptions());
  res.clearCookie('refreshToken', { ...baseCookieOptions(), path: '/api/v1/auth' });
};