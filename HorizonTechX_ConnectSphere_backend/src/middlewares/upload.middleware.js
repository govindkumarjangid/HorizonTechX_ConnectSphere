import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_MEDIA_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];

// Files stay in memory and are uploaded directly to Cloudinary
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest('Only JPG, PNG, and WEBP images are allowed for avatars'));
  },
});

const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MEDIA_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if ([...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(ApiError.badRequest('Only images (JPG, PNG, WEBP) and videos (MP4, WEBM, MOV) are allowed'));
  },
});

export const uploadAvatar = avatarUpload.single('avatar');
export const uploadMedia = mediaUpload.single('media');