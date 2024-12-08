import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import { useVisionAnalysis } from '@/hooks/useVisionAnalysis';
import { useImageUpload } from '@/hooks/useImageUpload';
import { validateImage } from '@/utils/imageProcessing';
import { logger } from '@/utils/logger';

interface AnalysisViewProps {
  imageUrl: string;
  progress: number;
  error: Error | null;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ imageUrl, progress, error }) => {
  const navigate = useNavigate();
  const { uploadImage, isUploading, uploadProgress } = useImageUpload();
  const { analyzeImage, isAnalyzing } = useVisionAnalysis();

  const [isProcessing, setIsProcessing] = React.useState(false);
  const processingRef = React.useRef(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const processImage = async () => {
      if (processingRef.current) return;
      processingRef.current = true;
      setIsProcessing(true);

      const imageUrl = localStorage.getItem('capturedImage');
      if (!imageUrl) {
        logger.error('analysis', 'No image found for analysis');
        navigate('/camera');
        processingRef.current = false;
        return;
      }

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Validate image before processing
        const validationError = validateImage(blob);
        if (validationError) {
          throw new Error(validationError);
        }

        logger.info('analysis', 'Starting image upload', { 
          size: blob.size,
          type: blob.type
        });

        const uploadedUrl = await uploadImage(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
        
        if (!uploadedUrl) {
          throw new Error('Upload failed');
        }

        logger.info('analysis', 'Starting image analysis', { uploadedUrl });
        const result = await analyzeImage(uploadedUrl);

        if (result) {
          logger.info('analysis', 'Analysis completed successfully', {
            itemsDetected: result.items?.length
          });
          localStorage.setItem('analysisResults', JSON.stringify(result));
          navigate('/results');
        } else {
          throw new Error('No results from analysis');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        logger.error('analysis', 'Analysis failed', { 
          error: errorMessage,
          retryCount
        });
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          processImage();
        }
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    };

    if (!processingRef.current) {
      processImage();
    }

    return () => {
      processingRef.current = true;
    };

  }, [isProcessing, navigate, uploadImage, analyzeImage]);

  const totalProgress = isUploading ? uploadProgress : (isAnalyzing ? progress : 0);

  const handleRetry = () => {
    setRetryCount(0);
    setIsProcessing(false);
    processingRef.current = false;
  };

  const handleUploadNew = () => {
    navigate('/camera');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black">
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {error ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-white text-xl font-medium mb-2">
                Analysis Failed
              </h2>
              <p className="text-white/70 text-sm">
                {error.message}
              </p>
              <div className="flex items-center justify-center gap-4">
                {retryCount < MAX_RETRIES && (
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Analysis
                  </button>
                )}
                <button
                  onClick={handleUploadNew}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload New Image
                </button>
              </div>
              <p className="text-sm text-white/50 mt-6">
                Tip: Try uploading a clearer image with good lighting
              </p>
            </>
          ) : (
            <>
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
                {isUploading ? 'Processing image...' : 'AI analyzing your style...'}
              </h2>
              <p className="text-gray-300 text-base">
                {isUploading 
                  ? 'Preparing your image for analysis'
                  : 'Finding similar items from thousands of products'
                }
              </p>
            </>
          )}
        </motion.div>

        <div className="absolute bottom-16 inset-x-4 max-w-md mx-auto">
          <ProgressBar 
            progress={totalProgress}
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

export default AnalysisView;