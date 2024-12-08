import React from 'react';
import { Trash2, Play, RefreshCw, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import TestRunner from '@/components/testing/TestRunner';
import TestCard from './TestCard';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/date';
import { simulateNetworkError, simulateTimeout, validateImageData, checkConnection } from '@/utils/testHelpers';
import type { TestResult } from '@/types/test';

const TestHistory: React.FC<{ results: TestResult[] }> = ({ results }) => {
  if (results.length === 0) {
    return <p className="text-gray-500 text-sm">No tests have been run yet</p>;
  }

  return (
    <div className="space-y-2">
      {results.map((result, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            {result.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">{result.name}</p>
              {result.error && (
                <p className="text-sm text-red-600">{result.error}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {result.duration && (
              <span className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {(result.duration / 1000).toFixed(1)}s
              </span>
            )}
            <span>{formatDate(result.timestamp)}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TestScenarios = () => {
  const navigate = useNavigate();
  const [testHistory, setTestHistory] = React.useState<TestResult[]>([]);
  const [isRunningAll, setIsRunningAll] = React.useState(false);

  const addTestResult = (result: TestResult) => {
    setTestHistory(prev => [result, ...prev]);
  };

  const clearHistory = () => {
    setTestHistory([]);
  };

  const runCameraPermissionTest = async () => {
    const startTime = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      await navigator.mediaDevices.getUserMedia({ video: true });
      await simulateTimeout(1000);
      // Cleanup
      stream.getTracks().forEach(track => track.stop());
      addTestResult({
        name: 'Camera Permission',
        status: 'success',
        timestamp: Date.now(),
        duration: Date.now() - startTime
      });
    } catch (err) {
      addTestResult({
        name: 'Camera Permission',
        status: 'error',
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        error: err instanceof Error ? err.message : 'Camera access failed'
      });
    }
  };

  const runUploadTest = async () => {
    const startTime = Date.now();
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    try {
      await simulateNetworkError();
      const buffer = await testFile.arrayBuffer();
      const error = validateImageData(buffer);
      if (error) throw new Error(error.message);
      await simulateTimeout(1500);
      addTestResult({
        name: 'File Upload',
        status: 'success',
        timestamp: Date.now(),
        duration: Date.now() - startTime
      });
    } catch (err) {
      addTestResult({
        name: 'File Upload',
        status: 'error',
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        error: 'File upload failed'
      });
    }
  };

  const runScanningTest = async () => {
    const startTime = Date.now();
    try {
      // Check connection first
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Network connection unavailable');
      }
      await simulateNetworkError();
      await simulateTimeout(2000);
      addTestResult({
        name: 'Image Scanning',
        status: 'success',
        timestamp: Date.now(),
        duration: Date.now() - startTime
      });
      navigate('/scanning');
    } catch (err) {
      addTestResult({
        name: 'Image Scanning',
        status: 'error',
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        error: 'Scanning process failed'
      });
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    try {
      await runCameraPermissionTest();
      await runUploadTest();
      await runScanningTest();
    } finally {
      setIsRunningAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Test Scenarios</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={runAllTests}
                disabled={isRunningAll}
                className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isRunningAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running All Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run All Tests
                  </>
                )}
              </button>
              <button
                onClick={clearHistory}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Clear History"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="divide-y">
            {/* Camera & Upload Tests */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Camera & Upload Tests</h2>
              <div className="space-y-4">
                <TestCard
                  name="Camera Test"
                  description="Test camera access and permissions"
                  status={isRunningAll ? 'running' : 'idle'}
                  onRun={runCameraPermissionTest}
                />
                <TestCard
                  name="Upload Test"
                  description="Test file upload functionality"
                  status={isRunningAll ? 'running' : 'idle'}
                  onRun={runUploadTest}
                />
              </div>
            </div>

            {/* Image Processing Tests */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Image Processing Tests</h2>
              <div className="space-y-4">
                <TestRunner
                  name="Scanning Process Test"
                  description="Test image analysis and processing"
                  onRun={runScanningTest}
                />
              </div>
            </div>

            {/* Test History */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Test History</h2>
              <TestHistory results={testHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestScenarios;