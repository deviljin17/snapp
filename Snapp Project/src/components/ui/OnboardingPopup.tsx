import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, ShoppingBag, X } from 'lucide-react';
import { FadeScale } from '../animations';
import AnimatedButton from './AnimatedButton';

const steps = [
  {
    icon: Camera,
    title: 'Snap a Photo',
    description: 'Take a picture of any clothing item you love'
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Our AI will analyze the style, color, and pattern'
  },
  {
    icon: ShoppingBag,
    title: 'Shop Similar Items',
    description: 'Browse and buy similar items from thousands of stores'
  }
];

const OnboardingPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenPopup', 'true');
    setShowPopup(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to StyleRo!</h2>
              <p className="text-gray-600">Let's get you started with a quick tour</p>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <FadeScale key={currentStep}>
                  <div className="text-center px-4">
                    <div className="mb-6">
                      {React.createElement(steps[currentStep].icon, {
                        className: "w-12 h-12 mx-auto text-indigo-600"
                      })}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h3>
                    <p className="text-gray-600">{steps[currentStep].description}</p>
                  </div>
                </FadeScale>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-8 mb-6">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <AnimatedButton
                onClick={handleNext}
                className="flex-1"
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingPopup;