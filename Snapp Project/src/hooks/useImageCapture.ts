import { useState } from 'react';
import { ErrorState } from '@/utils/errors';
import { checkImageQuality, compressImage } from '@/utils/imageQuality';

interface ImageCapture {
  url: string | null;
  file: File | null;
}

export const useImageCapture = () => {
  const [image, setImage] = useState<ImageCapture>({ url: null, file: null });
  const [error, setError] = useState<ErrorState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleImageCapture = async (image: Blob) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(image.type)) {
      setError({
        type: 'scanning',
        code: 'invalid_format',
        message: 'Invalid file format',
        suggestion: 'Please upload a JPG, PNG, or WEBP file'
      });
      return;
    }

    // Validate file size (5MB max)
    if (image.size > 5 * 1024 * 1024) {
      setError({
        type: 'scanning',
        code: 'file_too_large',
        message: 'File too large',
        suggestion: 'File size must be less than 5MB'
      });
      return;
    }

    // Check image quality
    const qualityCheck = await checkImageQuality(image);
    if (!qualityCheck.isValid) {
      setError({
        type: 'scanning',
        code: 'low_quality',
        message: 'Image quality issues detected',
        suggestion: qualityCheck.issues?.join('. ')
      });
      return;
    }

    // Compress image if needed
    const compressedImage = await compressImage(image);

    setError(null);
    setImage({
      url: URL.createObjectURL(compressedImage),
      file: new File([compressedImage], 'capture.jpg', { type: 'image/jpeg' })
    });
    setShowResults(false);
    
    // Simulate processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 2000);
  };

  const clearImage = () => {
    if (image.url) {
      URL.revokeObjectURL(image.url);
    }
    setImage({ url: null, file: null });
    setError(null);
    setShowResults(false);
  };

  return {
    image,
    error,
    isProcessing,
    showResults,
    handleImageCapture,
    clearImage
  };
};