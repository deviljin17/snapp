import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

interface LoadingViewProps {
  onTimeout?: () => void;
  timeoutDuration?: number;
}

const LoadingView: React.FC<LoadingViewProps> = ({
  onTimeout,
  timeoutDuration = 3000
}) => {
  const [progress, setProgress] = React.useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Progress animation
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 2, 90);
        return newProgress;
      });
    }, 50);

    // Timeout handler
    timeoutRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(100);
      onTimeout?.();
    }, timeoutDuration);

    // Cleanup
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeoutDuration, onTimeout]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black">
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              <Sparkles className="w-full h-full text-indigo-500" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-full h-full text-indigo-400 opacity-50" />
              </motion.div>
            </div>
          </motion.div>
          <h2 className="text-white text-2xl font-medium mb-3">
            AI analyzing your style...
          </h2>
          <p className="text-gray-300 text-base">
            Finding similar items from thousands of products
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute bottom-16 inset-x-4 max-w-md mx-auto">
          <ProgressBar 
            progress={progress}
            className="h-1.5"
            color="indigo" 
            showLabel={true}
            animate={true}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingView;