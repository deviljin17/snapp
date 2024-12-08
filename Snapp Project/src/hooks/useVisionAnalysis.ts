import { useState } from 'react';
import { visionService } from '@/services/visionService';
import { logger } from '@/utils/logger';
import { checkImageQuality } from '@/utils/imageQuality';
import type { ErrorState } from '@/utils/errors';

interface AnalysisResult {
  items: Array<{
    label: string;
    confidence: number;
    boundingBox: {
      left: number;
      top: number;
      width: number;
      height: number;
    };
    brand?: {
      name: string;
      confidence: number;
    };
  }>;
  detectionId: string;
}

export const useVisionAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<ErrorState | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeImage = async (imageUrl: string): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      // Check image quality first
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const qualityCheck = await checkImageQuality(imageBlob);

      if (!qualityCheck.isValid) {
        throw new Error(qualityCheck.issues?.join('. ') || 'Image quality check failed');
      }

      logger.info('vision', 'Starting image analysis', { 
        imageUrl,
        size: imageBlob.size 
      });
      // Start analysis progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 100);

      // Analyze with AWS Rekognition
      const analysisResult = await visionService.analyzeImage(imageUrl);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(analysisResult);
      
      logger.info('vision', 'Image analysis complete', {
        itemsDetected: analysisResult.items.length
      });

      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error('vision', 'Image analysis failed', {
        error: errorMessage,
        imageUrl
      });

      setError({
        type: 'scanning',
        code: 'analysis_failed',
        message: errorMessage,
        suggestion: 'Try uploading a clearer photo with good lighting'
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setIsAnalyzing(false);
    setProgress(0);
    setError(null);
    setResult(null);
  };

  return {
    analyzeImage,
    isAnalyzing,
    progress,
    error,
    result,
    reset
  };
};