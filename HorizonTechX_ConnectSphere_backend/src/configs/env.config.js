import dotenv from 'dotenv';

dotenv.config();

const errors = [];

const getString = (key, { required = false, fallback = '' } = {}) => {
  const value = process.env[key]?.trim();
  if (value) return value;
  if (required) errors.push(`${key} is required`);
  return fallback;
};

const getNumber = (key, fallback) => {
  const raw = getString(key, { fallback: String(fallback) });
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    errors.push(`${key} must be a positive number (got "${raw}")`);
    return fallback;
  }
  return value;
};

// same format generateToken.js understands: 15m, 1h, 7d
const getDuration = (key, fallback) => {
  const value = getString(key, { fallback });
  if (!/^\d+[smhd]$/.test(value)) {
    errors.push(`${key} must look like 15m, 1h or 7d (got "${value}")`);
    return fallback;
  }
  return value;
};

const nodeEnv = getString('NODE_ENV', { fallback: 'development' });
if (!['development', 'production', 'test'].includes(nodeEnv)) {
  errors.push(`NODE_ENV must be development, production or test (got "${nodeEnv}")`);
}
const isProd = nodeEnv === 'production';

const accessSecret = getString('ACCESS_TOKEN_SECRET', { required: true });
const refreshSecret = getString('REFRESH_TOKEN_SECRET', { required: true });

const cloudinary = {
  cloudName: getString('CLOUDINARY_CLOUD_NAME', { required: isProd }),
  apiKey: getString('CLOUDINARY_API_KEY', { required: isProd }),
  apiSecret: getString('CLOUDINARY_API_SECRET', { required: isProd }),
};

const env = {
  nodeEnv,
  isProd,
  isDev: nodeEnv === 'development',
  port: getNumber('PORT', 5000),
  mongoUri: getString('MONGO_URI', { required: true }),
  // CLIENT_URL can hold more than one origin, separated by commas
  clientUrls: getString('CLIENT_URL', { fallback: 'http://localhost:5173' })
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  jwt: {
    accessSecret,
    accessExpiresIn: getDuration('ACCESS_TOKEN_EXPIRES_IN', '15m'),
    refreshSecret,
    refreshExpiresIn: getDuration('REFRESH_TOKEN_EXPIRES_IN', '7d'),
  },
  cloudinary: {
    ...cloudinary,
    enabled: Boolean(cloudinary.cloudName && cloudinary.apiKey && cloudinary.apiSecret),
  },
};

if (accessSecret && accessSecret === refreshSecret)
  errors.push('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different');

if (isProd) {
  if (accessSecret && accessSecret.length < 32)
    errors.push('ACCESS_TOKEN_SECRET must be at least 32 characters in production');

  if (refreshSecret && refreshSecret.length < 32)
    errors.push('REFRESH_TOKEN_SECRET must be at least 32 characters in production');
}

if (errors.length > 0)
  throw new Error(`Invalid environment config:\n - ${errors.join('\n - ')}`);

Object.freeze(env.jwt);
Object.freeze(env.cloudinary);
Object.freeze(env.clientUrls);
Object.freeze(env);

export default env;