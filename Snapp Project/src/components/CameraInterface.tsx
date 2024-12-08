import React, { useState } from 'react';
import { ArrowLeft, Camera, Upload, Loader } from 'lucide-react';
import { validateFile } from '../utils/fileHelpers';
import CameraOverlay from './CameraOverlay';
import ProcessingOverlay from './ProcessingOverlay';
import CaptureAnimation from './CaptureAnimation';

interface ImagePreview {
  url: string;
  file: File;
}

interface CameraInterfaceProps {
  onBack: () => void;
  onResults: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({ onBack, onResults }) => {
  const [preview, setPreview] = useState<ImagePreview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(Math.min(currentProgress, 100));
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      handleImage(file);
    }
  };

  const handleImage = (file: File) => {
    setPreview({
      url: URL.createObjectURL(file),
      file
    });
  };

  const handleCapture = async () => {
    if (preview) {
      await processImage();
      return;
    }

    setIsCapturing(true);
    // Simulate capture delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsCapturing(false);
    
    // For demo, use a sample image
    const response = await fetch('https://images.unsplash.com/photo-1591047139829-d91aecb6caea');
    const blob = await response.blob();
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
    handleImage(file);
  };

  const processImage = async () => {
    if (!preview) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    simulateProgress();
    
    // Simulate API processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setProgress(0);
    onResults();
  };

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Top Bar */}
      <div className="fixed top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-lg z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <button 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={preview ? clearPreview : onBack}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">StyleRo</span>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="relative h-full pt-16">
        {preview ? (
          <img 
            src={preview.url} 
            alt="Preview" 
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60">
            <CameraOverlay isVisible={!preview} />
          </div>
        )}

        <CaptureAnimation isVisible={isCapturing} />
        <ProcessingOverlay isVisible={isProcessing} progress={progress} />

        {/* Error Message */}
        {error && (
          <div className="absolute top-20 inset-x-4">
            <div className="bg-red-500/90 text-white px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="fixed bottom-0 inset-x-0 p-6 flex justify-center items-end bg-gradient-to-t from-black/50 to-transparent">
          <div className="w-full max-w-md flex items-center justify-center space-x-6">
            {/* Upload Button */}
            <label className="p-4 rounded-full bg-white/20 backdrop-blur-lg cursor-pointer hover:bg-white/30 transition-colors">
              <Upload className="w-6 h-6 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>

            {/* Capture/Process Button */}
            <button
              onClick={handleCapture}
              disabled={isProcessing}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader className="w-8 h-8 text-black animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-black" />
              )}
            </button>

            {/* Spacer for alignment */}
            <div className="w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraInterface;