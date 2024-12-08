import React from 'react';

interface CaptureAnimationProps {
  isVisible: boolean;
}

const CaptureAnimation: React.FC<CaptureAnimationProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 animate-capture pointer-events-none">
      <div className="absolute inset-0 bg-white animate-flash" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-white rounded-lg animate-shrink" />
      </div>
    </div>
  );
};

export default CaptureAnimation;