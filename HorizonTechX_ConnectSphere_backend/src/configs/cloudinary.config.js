import { v2 as cloudinary } from 'cloudinary';
import env from './env.config.js';
import ApiError from '../utils/ApiError.js';
import { PRESETS, ROOT_FOLDER, ALLOWED_FORMATS } from "../constents.js"


if (env.cloudinary.enabled)
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });

const assertEnabled = () => {
  if (!env.cloudinary.enabled)
    throw new ApiError(503, 'Image upload is not configured');
};

// buffer comes from multer memoryStorage. type is 'avatar' or 'post'
// returns { url, publicId }, same shape as the image field in the models
export const uploadImage = (buffer, type = 'post') => {
  assertEnabled();

  const preset = PRESETS[type];

  if (!preset)
    throw new Error(`Unknown image type "${type}". Use one of: ${Object.keys(PRESETS).join(', ')}`);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${ROOT_FOLDER}/${preset.folder}`,
        resource_type: 'image',
        allowed_formats: ALLOWED_FORMATS,
        transformation: preset.transformation,
      },
      (error, result) => {
        if (error || !result) {
          console.error(`Cloudinary upload failed: ${error?.message}`);
          return reject(new ApiError(502, 'Image upload failed. Please try again'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

// cleanup should never break the request, so failures are logged and swallowed
export const deleteImage = async (publicId) => {
  if (!publicId || !env.cloudinary.enabled) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return result.result === 'ok';
  } catch (error) {
    console.error(`Cloudinary delete failed for ${publicId}: ${error.message}`);
    return false;
  }
};

export default cloudinary;