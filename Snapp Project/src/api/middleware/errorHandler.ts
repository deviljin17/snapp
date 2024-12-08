import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../services/loggerService';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  LoggerService.logAPIError(req.path, err, req.user?.id);

  // Default error message for production
  const defaultError = {
    message: 'Something went wrong. Please try again later.',
    code: 'INTERNAL_ERROR'
  };

  // Specific error messages for known error types
  const errorMessages: Record<string, { message: string; code: string }> = {
    FILE_TOO_LARGE: {
      message: 'The uploaded file is too large. Maximum size is 5MB.',
      code: 'FILE_SIZE_ERROR'
    },
    INVALID_FILE_TYPE: {
      message: 'Invalid file type. Please upload a JPG, PNG, or WEBP image.',
      code: 'FILE_TYPE_ERROR'
    },
    NO_ITEMS_DETECTED: {
      message: 'No clothing items were detected in the image. Please try another photo.',
      code: 'DETECTION_ERROR'
    },
    STORE_UNAVAILABLE: {
      message: 'Store is temporarily unavailable. Please try again later.',
      code: 'STORE_ERROR'
    }
  };

  // Determine appropriate error response
  const error = errorMessages[err.code || ''] || defaultError;
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? error : {
      ...error,
      details: err.details,
      stack: err.stack
    }
  });
};