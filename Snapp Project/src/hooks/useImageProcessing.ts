import { useState } from 'react';
import { processImage, validateImage, revokeImageUrl } from '@/utils/imageProcessing';
import type { ProcessedImage } from '@/utils/imageProcessing';

export const useImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);

  const processImageFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validate file first
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      // Clean up previous processed image if it exists
      if (processedImage?.url) {
        revokeImageUrl(processedImage.url);
      }

      // Process the new image
      const processed = await processImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'jpeg'
      });

      setProcessedImage(processed);
      return processed;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image';
      setError(message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = () => {
    if (processedImage?.url) {
      revokeImageUrl(processedImage.url);
      setProcessedImage(null);
    }
    setError(null);
  };

  return {
    processImageFile,
    isProcessing,
    error,
    processedImage,
    cleanup
  };
};