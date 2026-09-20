import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// files stay in memory and go straight to Cloudinary, nothing is written to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest('Only JPG, PNG and WEBP images are allowed'));
  },
});

export const uploadAvatar = upload.single('avatar');
export const uploadPostImage = upload.single('image');