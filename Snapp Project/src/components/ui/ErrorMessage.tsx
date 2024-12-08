import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorState } from '@/utils/errors';

interface ErrorMessageProps {
  error: ErrorState;
  onRetry?: () => void;
  onAlternative?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onAlternative
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-100 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-800 font-medium mb-1">{error.message}</h3>
          {error.suggestion && (
            <p className="text-red-600 text-sm">{error.suggestion}</p>
          )}
          
          {(onRetry || onAlternative) && (
            <div className="mt-3 flex gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1 text-sm text-red-700 hover:text-red-800"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
              {onAlternative && (
                <button
                  onClick={onAlternative}
                  className="text-sm text-red-700 hover:text-red-800"
                >
                  Try Alternative
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;