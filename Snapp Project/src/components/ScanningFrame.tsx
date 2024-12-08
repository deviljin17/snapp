import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanningFrameProps {
  onScanComplete?: () => void;
}

const ScanningFrame: React.FC<ScanningFrameProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        onScanComplete?.();
      }, 2300);
      return () => clearTimeout(timer);
    }
  }, [isScanning, onScanComplete]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Main Image */}
      <div className="absolute inset-0 bg-black">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80"
          alt="Scan target"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Scanning Elements */}
      <AnimatePresence>
        {isScanning && (
          <>
            {/* Corner Brackets */}
            <div className="absolute inset-12 flex items-center justify-center">
              {/* Top-left */}
              <div className="absolute top-0 left-0">
                <div className="relative animate-bracket-pulse">
                  <div className="absolute left-0 top-0 w-8 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  <div className="absolute left-0 top-0 w-0.5 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
              {/* Top-right */}
              <div className="absolute top-0 right-0">
                <div className="relative animate-bracket-pulse [animation-delay:200ms]">
                  <div className="absolute right-0 top-0 w-8 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  <div className="absolute right-0 top-0 w-0.5 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0">
                <div className="relative animate-bracket-pulse [animation-delay:400ms]">
                  <div className="absolute left-0 bottom-0 w-8 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  <div className="absolute left-0 bottom-0 w-0.5 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0">
                <div className="relative animate-bracket-pulse [animation-delay:600ms]">
                  <div className="absolute right-0 bottom-0 w-8 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  <div className="absolute right-0 bottom-0 w-0.5 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <button
        onClick={() => !isScanning && setIsScanning(true)}
        disabled={isScanning}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-8 py-4 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Camera className="w-6 h-6" />
        <span className="font-medium text-lg">Snap & Shop</span>
      </button>
    </div>
  );
};

export default ScanningFrame;