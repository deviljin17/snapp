import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavigationButton } from '../ui/index';

interface CaptureViewProps {
  onCapture: (blob: Blob) => void;
  onBack: () => void;
  error?: string | null;
}

const CaptureView: React.FC<CaptureViewProps> = ({ onCapture, onBack, error }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  React.useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize camera';
      console.error('Camera initialization failed:', message);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !stream) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.drawImage(videoRef.current, 0, 0);
    
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCapture(blob);
          } else {
            throw new Error('Failed to capture image');
          }
        },
        'image/jpeg',
        0.8
      );
    } catch (err) {
      console.error('Capture failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-lg z-10">
        <div className="h-full px-4 flex items-center">
          <NavigationButton onClick={onBack} />
        </div>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 inset-x-4 bg-red-500/90 text-white px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-6 flex justify-center items-end bg-gradient-to-t from-black/50 to-transparent">
        <div className="w-full max-w-md flex items-center justify-center space-x-6">
          <label className="p-4 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-colors cursor-pointer">
            <Upload className="w-6 h-6 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onCapture(file);
                }
              }}
            />
          </label>

          <button
            onClick={handleCapture}
            disabled={!stream}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Camera className="w-8 h-8 text-black" />
          </button>

          <div className="w-14" />
        </div>
      </div>
    </div>
  );
};

export default CaptureView;