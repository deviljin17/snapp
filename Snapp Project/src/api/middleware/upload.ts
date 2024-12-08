import multer from 'multer';
import { Request } from 'express';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../config';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP files are allowed.'));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});