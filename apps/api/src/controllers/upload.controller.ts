import { Response } from 'express';
import { cloudinary } from '../config/cloudinary';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';

interface UploadResult {
  url: string;
  publicId: string;
}

function uploadBuffer(buffer: Buffer): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'rush/products' },
      (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export const uploadImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) throw new AppError('Image file is required', 400);
  const result = await uploadBuffer(req.file.buffer);
  sendSuccess(res, result, 201, undefined, 'Image uploaded');
});

export const uploadImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) throw new AppError('At least one image is required', 400);
  const results = await Promise.all(files.map((file) => uploadBuffer(file.buffer)));
  sendSuccess(res, results, 201, undefined, 'Images uploaded');
});
