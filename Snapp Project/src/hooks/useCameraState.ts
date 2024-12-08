import React, { useState, useCallback, useEffect } from 'react';

export type CameraViewState = 'camera' | 'analyzing' | 'results';

interface CapturedImage {
  url: string;
  blob: Blob;
}

export const useCameraState = () => {
  const [viewState, setViewState] = useState<CameraViewState>('camera');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (capturedImage?.url) {
      return () => URL.revokeObjectURL(capturedImage.url);
    }
  }, [capturedImage]);

  const handleCapture = async (imageBlob: Blob) => {
    try {
      const imageUrl = URL.createObjectURL(imageBlob);

      // Validate image size
      if (imageBlob.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // Validate image type
      if (!imageBlob.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image.');
      }

      setCapturedImage({ url: imageUrl, blob: imageBlob });
      setViewState('analyzing');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process image'));
      setViewState('camera');
    }
  };

  const resetCamera = () => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    setCapturedImage(null);
    setError(null);
    setViewState('camera');
  };

  return {
    viewState,
    capturedImage,
    error,
    handleCapture,
    resetCamera,
    setViewState
  };
};