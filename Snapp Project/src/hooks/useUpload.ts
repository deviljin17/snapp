import { useState } from 'react';
import { uploadService } from '../utils/uploadService';
import { useImageProcessing } from './useImageProcessing';
import { logger } from '../utils/logger';

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { processImageFile, isProcessing } = useImageProcessing();

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Process image first
      const processed = await processImageFile(file);
      if (!processed) {
        throw new Error('Image processing failed');
      }

      // Upload to S3
      const imageUrl = await uploadService.uploadImage(processed.blob, {
        onProgress: ({ loaded, total }) => {
          const progress = (loaded / total) * 100;
          setUploadProgress(Math.round(progress));
        }
      });

      logger.info('upload', 'Image upload complete', { imageUrl });
      return imageUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      logger.error('upload', 'Image upload failed', err);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadImage,
    isUploading,
    isProcessing: isProcessing || isUploading,
    progress: uploadProgress,
    error
  };
};