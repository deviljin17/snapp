import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraViewfinder from './CameraViewfinder';
import CameraControls from './CameraControls';
import CameraHeader from './CameraHeader';
import { useCameraInit } from '@/hooks/useCameraInit';
import ErrorMessage from '../ui/ErrorMessage';

const CameraView: React.FC = () => {
  const navigate = useNavigate();
  const { 
    stream,
    error,
    isInitializing,
    initializeCamera
  } = useCameraInit();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    if (!stream) return;
    setIsCapturing(true);

    try {
      const video = document.querySelector('video');
      if (!video) throw new Error('Video element not found');

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Store the captured image and proceed to scanning
            localStorage.setItem('capturedImage', URL.createObjectURL(blob));
            navigate('/scanning');
          } else {
            throw new Error('Failed to create image blob');
          }
        },
        'image/jpeg',
        0.8
      );
    } catch (err) {
      console.error('Capture failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      // Handle invalid file type
      return;
    }
    navigate('/scanning');
  };

  return (
    <div className="fixed inset-0 bg-black">
      <CameraHeader onBack={() => navigate('/')} />
      
      <div className="relative h-full">
        <CameraViewfinder
          stream={stream}
          isCapturing={isCapturing}
          isInitializing={isInitializing}
        />

        {error && (
          <div className="absolute top-20 inset-x-4">
            <ErrorMessage
              error={error}
              onRetry={initializeCamera}
              onAlternative={() => document.getElementById('file-upload')?.click()}
            />
          </div>
        )}

        <CameraControls
          onCapture={handleCapture}
          onFileUpload={handleFileUpload}
          disabled={!stream || isCapturing}
          isCapturing={isCapturing}
        />
      </div>
    </div>
  );
};

export default CameraView;