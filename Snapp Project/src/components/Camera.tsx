import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCameraState } from '@/hooks/useCameraState';
import CaptureView from './camera/CaptureView';
import AnalysisView from './loading/AnalysisView';
import ResultsView from './results/ResultsView';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysis } from '@/hooks/useAnalysis';

const Camera: React.FC = () => {
  const navigate = useNavigate();
  const { isAnalyzing, progress, error: analysisError, startAnalysis } = useAnalysis();
  const {
    viewState, 
    capturedImage, 
    error, 
    handleCapture, 
    resetCamera, 
    showResults,
    setViewState
  } = useCameraState();

  const handleAnalysis = React.useCallback(async () => {
    if (viewState === 'analyzing') {
      const success = await startAnalysis();
      if (success) {
        setViewState('results');
      } else {
        setViewState('camera');
      }
    }
  }, [viewState, startAnalysis, setViewState]);

  React.useEffect(() => {
    handleAnalysis();
  }, [handleAnalysis]);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {viewState === 'camera' && (
          <motion.div
            key="capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <CaptureView
              onCapture={handleCapture}
              onBack={() => navigate('/')}
              error={error?.message}
            />
          </motion.div>
        )}
        
        {viewState === 'analyzing' && capturedImage && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <AnalysisView 
              imageUrl={capturedImage.url}
              progress={progress}
              error={analysisError}
            />
          </motion.div>
        )}
        
        {viewState === 'results' && capturedImage && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <ResultsView
              imageUrl={capturedImage.url}
              onBack={resetCamera}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Camera;