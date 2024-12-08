import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../transitions/PageTransition';
import LoadingView from '../loading/LoadingView';
import { useVisionAnalysis } from '@/hooks/useVisionAnalysis';

const ScanningView: React.FC = () => {
  const navigate = useNavigate();
  const { isAnalyzing, error } = useVisionAnalysis();

  const handleTimeout = () => {
    navigate('/results');
  };

  return (
    <PageTransition>
      <LoadingView onTimeout={handleTimeout} timeoutDuration={3000} />
    </PageTransition>
  );
};

export default ScanningView;