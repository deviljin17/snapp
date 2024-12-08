import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface CameraHeaderProps {
  onBack: () => void;
}

const CameraHeader: React.FC<CameraHeaderProps> = ({ onBack }) => {
  return (
    <div className="absolute top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-lg z-10">
      <div className="h-full px-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <span className="text-white font-medium">Take Photo</span>
        <div className="w-10" />
      </div>
    </div>
  );
};

export default CameraHeader;