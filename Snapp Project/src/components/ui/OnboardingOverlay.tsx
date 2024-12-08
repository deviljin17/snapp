import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ONBOARDING_KEY = 'stylero_onboarding_complete';

const OnboardingOverlay = () => {
  const [isVisible, setIsVisible] = React.useState(() => {
    return !localStorage.getItem(ONBOARDING_KEY);
  });

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        <div className="h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Welcome to StyleRo!</h2>
              <button
                onClick={handleComplete}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Take a Photo</h3>
                  <p className="text-sm text-gray-600">
                    Snap a picture of any clothing item you like
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Our AI will analyze the style, color, and pattern
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">Shop Similar Items</h3>
                  <p className="text-sm text-gray-600">
                    Browse and buy similar items from thousands of stores
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingOverlay;