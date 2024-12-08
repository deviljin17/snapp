import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';

interface CameraViewfinderProps {
  stream: MediaStream | null;
  isCapturing: boolean;
  isInitializing: boolean;
}

const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  stream,
  isCapturing,
  isInitializing
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current?.play();
        } catch (err) {
          console.error('Failed to play video:', err);
        }
      };
    }
  }, [stream]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Camera Grid */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="border border-white/10" />
        ))}
      </div>

      {/* Capture Animation */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isInitializing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white"
          >
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm opacity-75">Initializing camera...</p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CameraViewfinder;