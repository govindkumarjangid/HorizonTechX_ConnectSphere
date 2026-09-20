export const SALT_ROUNDS = 12;

export const UNIT_MS = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };

export const ROOT_FOLDER = 'horizontechx_pulsesphere';
export const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];

export const API_PREFIX = '/api/v1';

export const SHUTDOWN_TIMEOUT_MS = 10_000;

export const PRESETS = {
  avatar: {
    folder: 'avatars',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  },
  post: {
    folder: 'posts',
    transformation: [
      { width: 1080, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  },
};