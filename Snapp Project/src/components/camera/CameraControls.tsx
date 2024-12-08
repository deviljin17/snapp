import React from 'react';
import { Camera, Image } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraControlsProps {
  onCapture: () => void;
  onFileUpload: (file: File) => void;
  disabled: boolean;
  isCapturing: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  onCapture,
  onFileUpload,
  disabled,
  isCapturing
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="absolute bottom-0 inset-x-0 p-6 flex justify-center items-end bg-gradient-to-t from-black/50 to-transparent">
      <div className="w-full max-w-md flex items-center justify-center space-x-6">
        {/* Gallery Upload */}
        <label className="p-4 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-colors cursor-pointer">
          <Image className="w-6 h-6 text-white" />
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {/* Capture Button */}
        <button
          onClick={onCapture}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 relative"
        >
          <Camera className="w-8 h-8 text-black" />
          {!disabled && !isCapturing && (
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </button>

        {/* Spacer for alignment */}
        <div className="w-14" />
      </div>
    </div>
  );
};

export default CameraControls;