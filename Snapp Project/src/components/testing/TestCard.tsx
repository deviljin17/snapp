import React from 'react';
import { Play, RefreshCw, AlertCircle, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestCardProps {
  name: string;
  description: string;
  status: 'idle' | 'running' | 'success' | 'error';
  error?: string;
  duration?: number;
  onRun: () => Promise<void>;
  onRetry?: () => Promise<void>;
  children?: React.ReactNode;
}

export default function TestCard({
  name,
  description,
  status,
  error,
  duration,
  onRun,
  onRetry,
  children
}: TestCardProps) {
  const [isRunning, setIsRunning] = React.useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRun();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button
          onClick={status === 'error' && onRetry ? onRetry : handleRun}
          disabled={isRunning}
          className="px-3 py-1.5 bg-black text-white text-sm rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : status === 'error' && onRetry ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Retry
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Test
            </>
          )}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-md p-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}

      {children}
    </div>
  );
}