import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DownloadBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed bottom-0 inset-x-0 bg-black z-50 shadow-lg safe-area-bottom"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <p className="text-sm sm:text-base font-semibold tracking-wide text-white">
              Download Snapp Now: Your Perfect Fit is One Snap Away
            </p>
            <div className="hidden sm:flex items-center gap-3">
              <a href="#" className="app-store-badge w-[100px] sm:w-[120px] h-[32px] sm:h-[36px]">
                <img
                  src="/images/apple.png"
                  alt="Download on App Store"
                  className="w-full h-full object-contain"
                />
              </a>
              <a href="#" className="app-store-badge w-[100px] sm:w-[120px] h-[32px] sm:h-[36px]">
                <img
                  src="/images/google.png"
                  alt="Get it on Google Play"
                  className="w-full h-full object-contain"
                />
              </a>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadBanner;