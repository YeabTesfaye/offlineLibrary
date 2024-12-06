import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import BadRequestError from '../errors/bad-request';
import cloudinary from '../configs/cloudinary.config';

/**
 * Uploads a video file to Cloudinary.
 * @param file - The video file to be uploaded.
 * @returns The Cloudinary URL of the uploaded video.
 */
export const uploadVideo = async (file?: any): Promise<string> => {
  if (!file) {
    return 'https://example.com/default_video_placeholder.mp4'; // Return a default video URL if no file is provided
  }

  try {
    // Validate file type (only video types allowed)
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mkv'];
    if (!allowedVideoTypes.includes(file.mimetype)) {
      throw new BadRequestError(
        'Invalid video format. Only MP4, AVI, and MKV are allowed.',
      );
    }

    // Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'video', // Specify video upload
      use_filename: true,
      folder: 'lms_videos',
    });

    fs.unlinkSync(file.tempFilePath); // Clean up local temp file

    return result.secure_url; // Return the Cloudinary video URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new BadRequestError('Failed to upload video to Cloudinary.');
  }
};
