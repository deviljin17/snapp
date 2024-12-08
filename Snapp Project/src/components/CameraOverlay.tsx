import React from 'react';
import { Camera } from 'lucide-react';

interface CameraOverlayProps {
  isVisible: boolean;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0">
      {/* Camera Grid */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="border border-white/10"
          />
        ))}
      </div>
      
      {/* Center Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-white/20 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/20" />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute inset-x-0 bottom-32 flex justify-center">
        <div className="text-center text-white">
          <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm opacity-75">Point camera at any clothing item</p>
        </div>
      </div>
    </div>
  );
};

export default CameraOverlay;