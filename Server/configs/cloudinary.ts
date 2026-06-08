import { v2 as cloudinary } from 'cloudinary';

// CLOUDINARY_URL env var is auto-detected by the SDK
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
if (!process.env.CLOUDINARY_URL) {
  console.warn('WARNING: CLOUDINARY_URL is not set. Image uploads will fail.');
}

export default cloudinary;
