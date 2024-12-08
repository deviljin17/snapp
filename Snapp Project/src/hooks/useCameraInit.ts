import { useState, useEffect } from 'react';
import { checkCameraSupport, requestCameraPermission } from '@/utils/camera';
import { logger } from '@/utils/logger';
import { ERROR_MESSAGES } from '@/utils/errors';
import type { ErrorState } from '@/utils/errors';

export const useCameraInit = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const initializeCamera = async () => {
    if (isInitializing) return;
    setIsInitializing(true);
    setError(null);

    try {
      const { supported, error: supportError } = await checkCameraSupport();
      
      if (!supported) {
        setError({
          type: 'camera',
          code: 'not_supported',
          message: supportError || 'Camera not supported',
          suggestion: 'Try using a different device or browser'
        });
        return;
      }

      const { granted, stream, error: permissionError } = await requestCameraPermission();
      
      if (!granted || !stream) {
        setError({
          type: 'camera',
          code: 'permission_denied',
          message: permissionError || 'Camera permission denied',
          suggestion: 'Please allow camera access when prompted'
        });
        return;
      }

      setStream(stream);
      setError(null);
      logger.info('camera', 'Camera initialized successfully');
    } catch (err) {
      logger.error('camera', 'Camera initialization failed', err);
      setError({
        type: 'camera',
        code: 'initialization_failed',
        ...ERROR_MESSAGES.camera.initialization_failed
      });
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    stream,
    error,
    isInitializing,
    initializeCamera
  };
};