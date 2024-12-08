import React from 'react';
import { Loader } from 'lucide-react';

interface ProcessingOverlayProps {
  isVisible: boolean;
  progress: number;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isVisible, progress }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-64 text-center">
        <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-white" />
        <p className="text-white text-sm mb-4">Analyzing your style...</p>
        
        {/* Progress Bar */}
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;