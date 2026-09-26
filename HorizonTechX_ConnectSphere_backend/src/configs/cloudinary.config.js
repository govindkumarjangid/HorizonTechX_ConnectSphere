import { v2 as cloudinary } from 'cloudinary';
import env from './env.config.js';
import ApiError from '../utils/ApiError.js';
import { PRESETS, ROOT_FOLDER } from '../constents.js';

if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

const assertEnabled = () => {
  if (!env.cloudinary.enabled)
    throw new ApiError(503, 'Media upload is not configured on the server');
};


export const uploadMedia = (buffer, { type = 'post', mimetype = 'image/jpeg' } = {}) => {
  assertEnabled();

  const isVideo = mimetype && mimetype.startsWith('video/');
  const mediaType = isVideo ? 'video' : 'image';
  const preset = PRESETS[type] || PRESETS.post;

  const uploadOptions = {
    folder: `${ROOT_FOLDER}/${preset.folder || 'posts'}`,
    resource_type: isVideo ? 'video' : 'image',
  };

  if (!isVideo && preset.transformation)
    uploadOptions.transformation = preset.transformation;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        console.error(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`);
        return reject(new ApiError(502, 'File upload failed. Please try again'));
      }
      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        mediaType,
      });
    });

    stream.end(buffer);
  });
};

export const uploadImage = (buffer, type = 'post') => {
  return uploadMedia(buffer, { type, mimetype: 'image/jpeg' });
};


export const deleteMedia = async (publicId, mediaType = 'image') => {
  if (!publicId || !env.cloudinary.enabled) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: mediaType === 'video' ? 'video' : 'image',
      invalidate: true,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error(`Cloudinary delete failed for ${publicId}: ${error.message}`);
    return false;
  }
};

export const deleteImage = (publicId) => deleteMedia(publicId, 'image');

export default cloudinary;