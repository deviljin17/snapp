import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface TutorialTooltipProps {
  id: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

const TutorialTooltip = ({
  id,
  title,
  content,
  position = 'bottom',
  children
}: TutorialTooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(() => {
    return !localStorage.getItem(`tutorial_${id}`);
  });

  const handleDismiss = () => {
    localStorage.setItem(`tutorial_${id}`, 'true');
    setIsVisible(false);
  };

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div className="relative">
        {children}
        {isVisible && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute ${positionStyles[position]} z-50 w-64`}
          >
            <div className="bg-white rounded-lg shadow-lg border p-4">
              <div className="flex items-start gap-3 mb-2">
                <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">{title}</h4>
                  <p className="text-sm text-gray-600">{content}</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TutorialTooltip;