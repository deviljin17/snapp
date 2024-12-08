import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, ShoppingBag, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Camera,
    title: 'Take a Photo',
    description: 'Snap a picture of any clothing item you like'
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

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = React.useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('onboarding_complete', 'true');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Welcome to StyleRo!</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <div className="mb-4">
                      {React.createElement(steps[step].icon, {
                        className: "w-12 h-12 mx-auto text-indigo-600"
                      })}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{steps[step].title}</h3>
                    <p className="text-gray-600">{steps[step].description}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2 mt-6 mb-8">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === step ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {step < steps.length - 1 ? 'Next' : 'Get Started'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;