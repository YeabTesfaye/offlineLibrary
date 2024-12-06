import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
  // Add this to disable strict SSL validation
  private_cdn: false,
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Allow self-signed certificates
export default cloudinary;
