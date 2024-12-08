import React from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestRunnerProps {
  name: string;
  description: string;
  onRun: () => Promise<void>;
}

export default function TestRunner({ name, description, onRun }: TestRunnerProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    try {
      await onRun();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Test
            </>
          )}
        </button>
      </div>
    </div>
  );
}