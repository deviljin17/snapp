import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, ArrowLeft, Image, Zap, ZapOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { checkCameraSupport, requestCameraPermission } from '@/utils/camera';
import { logger } from '@/utils/logger';
import CameraGuide from './CameraGuide';
import ErrorMessage from '../ui/ErrorMessage';
import { ERROR_MESSAGES } from '@/utils/errors';

interface CameraPermissionState {
  granted: boolean;
  requested: boolean;
}

interface CameraComponentProps {
  onCapture: (image: Blob) => void;
  onError: (error: Error) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture, onError }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const [permissionState, setPermissionState] = useState<CameraPermissionState>({
    granted: false,
    requested: false
  });
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [isSupported, setIsSupported] = useState(true);
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [manualBrand, setManualBrand] = useState('');
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const commonBrands = [
    'Nike', 'Adidas', 'Gucci', 'Zara', 'H&M',
    'Uniqlo', 'Prada', 'Louis Vuitton', 'Calvin Klein',
    'Ralph Lauren', 'Tommy Hilfiger', 'Under Armour'
  ];

  useEffect(() => {
    const init = async () => {
      if (isInitializing) return;
      setIsInitializing(true);
      setError(null);

      try {
        // First check if camera is supported
        const { supported, error: supportError } = await checkCameraSupport();
        
        if (!supported) {
          setError({
            type: 'camera',
            code: 'not_supported',
            message: supportError || 'Camera not supported',
            suggestion: 'Try using a different device or browser'
          });
          return;
        }

        // Request camera permission
        const { granted, stream, error: permissionError } = await requestCameraPermission();
        
        if (!granted || !stream) {
          setError({
            type: 'camera',
            code: 'permission_denied',
            message: permissionError || 'Camera permission denied',
            suggestion: 'Please allow camera access when prompted'
          });
          return;
        }

        // Initialize camera with stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(console.error);
          };
          setStream(stream);
          setError(null);
          setHasInitialized(true);
        }
      } catch (err) {
        console.error('Camera initialization error:', err);
        setError({
          type: 'camera',
          code: 'initialization_failed',
          message: 'Failed to initialize camera',
          suggestion: 'Please try again or check your camera settings'
        });
      } finally {
        setIsInitializing(false);
      }
    };

    init();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    if (isInitializing) return;
    setIsInitializing(true);
    setError(null);

    try {
      // First check if camera is supported
      const { supported, error: supportError } = await checkCameraSupport();
      
      if (!supported) {
        setError({
          type: 'camera',
          code: 'not_supported',
          message: supportError || 'Camera not supported',
          suggestion: 'Try using a different device or browser'
        });
        return;
      }

      // Request camera permission
      const { granted, stream, error: permissionError } = await requestCameraPermission();
      
      if (!granted || !stream) {
        setError({
          type: 'camera',
          code: 'permission_denied',
          message: permissionError || 'Camera permission denied',
          suggestion: 'Please allow camera access when prompted'
        });
        return;
      }

      // Initialize camera with stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setStream(stream);
        setError(null);
        setHasInitialized(true);
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError({
        type: 'camera',
        code: 'initialization_failed',
        message: 'Failed to initialize camera',
        suggestion: 'Please try again or check your camera settings'
      });

  const handleError = (code: string, message?: string) => {
    logger.error('camera', `Camera error: ${code}`, { message });
    setError({
      type: 'camera',
      code,
      ...ERROR_MESSAGES.camera[code as keyof typeof ERROR_MESSAGES.camera],
      message: message || ERROR_MESSAGES.camera[code as keyof typeof ERROR_MESSAGES.camera].message
    });
  };
  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      switch (result.state) {
        case 'granted':
          setPermissionState({ granted: true, requested: true });
          initializeCamera();
          break;
        case 'prompt':
          setPermissionState({ granted: false, requested: false });
          initializeCamera();
          break;
        case 'denied':
          setPermissionState({ granted: false, requested: true });
          setError({
            type: 'camera',
            code: 'permission_denied',
            ...ERROR_MESSAGES.camera.permission_denied
          });
          break;
      }

      result.addEventListener('change', () => {
        if (result.state === 'granted') {
          setPermissionState({ granted: true, requested: true });
          setError(null);
          initializeCamera();
        } else if (result.state === 'denied') {
          setPermissionState({ granted: false, requested: true });
          setError({
            type: 'camera',
            code: 'permission_denied',
            ...ERROR_MESSAGES.camera.permission_denied
          });
        }
      });
    } catch (err) {
      // Fallback for browsers that don't support permissions API
      initializeCamera();
    }
  };

  const initializeCamera = async () => {
    const { granted, stream: newStream, error: permissionError } = await requestCameraPermission();
    
    if (!granted || !newStream) {
      setError({
        type: 'camera',
        code: 'permission_denied',
        message: permissionError || 'Camera permission denied',
        suggestion: 'Please allow camera access when prompted'
      });
      return;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = newStream;
      setStream(newStream);
      setError(null);
      setHasInitialized(true);
    }
  };

  const toggleFlash = async () => {
    if (!stream) return;
    
    logger.info('camera', 'Toggling flash');
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    
    if (capabilities.torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isFlashOn }]
        });
        setIsFlashOn(!isFlashOn);
        logger.info('camera', 'Flash toggled', { state: !isFlashOn });
      } catch (err) {
        logger.error('camera', 'Flash toggle failed', { error: err });
        console.error('Flash not available');
      }
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !stream) return;
    
    logger.info('camera', 'Starting image capture');
    setIsCapturing(true);
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      logger.info('camera', 'Canvas setup', { 
        width: canvas.width,
        height: canvas.height 
      });
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          logger.info('camera', 'Image captured successfully', { 
            size: blob.size,
            type: blob.type 
          });
          onCapture(blob);
        } else {
          logger.error('camera', 'Failed to create image blob');
          throw new Error('Failed to capture image');
        }
      }, 'image/jpeg', 0.8);
    } catch (err) {
      logger.error('camera', 'Image capture failed', { error: err });
      onError(err instanceof Error ? err : new Error('Capture failed'));
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError({
        type: 'camera',
        code: 'invalid_file',
        message: 'Please upload an image file',
        suggestion: 'Supported formats: JPG, PNG, WEBP'
      });
      return;
    }

    onCapture(file);
  };

  const handleBrandInput = (value: string) => {
    setManualBrand(value);
    // Filter brand suggestions based on input
    const suggestions = commonBrands.filter(brand =>
      brand.toLowerCase().includes(value.toLowerCase())
    );
    setBrandSuggestions(suggestions);
  };

  const handleBrandSubmit = () => {
    if (manualBrand) {
      onCapture({
        ...image,
        manualBrand
      });
      setShowBrandInput(false);
      setManualBrand('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera View */}
      <div className="relative h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Error Message */}
        {error && (
          <div className="absolute top-20 inset-x-4">
            <ErrorMessage
              key={error.code}
              error={error}
              onRetry={() => {
                if (!isSupported) {
                  // Open file upload if camera not supported
                  document.getElementById('file-upload')?.click();
                } else if (error.code === 'permission_denied') {
                  // Request permissions again
                  initializeCamera();
                } else {
                  // Retry camera initialization
                  initializeCamera();
                }
              }}
              onAlternative={() => document.getElementById('file-upload')?.click()}
            />
          </div>
        )}

        {/* Capture Animation */}
        <AnimatePresence>
          {isCapturing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Camera Grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>

        {/* Camera Guide */}
        <CameraGuide />

        {/* Brand Input Modal */}
        <AnimatePresence>
          {showBrandInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-4 bottom-32 bg-white rounded-lg p-4 shadow-lg"
            >
              <h3 className="text-lg font-medium mb-3">
                Couldn't detect brand? Enter it manually
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={manualBrand}
                  onChange={(e) => handleBrandInput(e.target.value)}
                  placeholder="Enter brand name..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {brandSuggestions.length > 0 && manualBrand && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border max-h-48 overflow-y-auto">
                    {brandSuggestions.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setManualBrand(brand);
                          setBrandSuggestions([]);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowBrandInput(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBrandSubmit}
                  disabled={!manualBrand}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Bar */}
        <div className="absolute top-0 inset-x-0 h-16 bg-black/50 backdrop-blur-lg">
          <div className="h-full px-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={toggleFlash}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              disabled={!stream?.getVideoTracks()[0]?.getCapabilities()?.torch}
            >
              {isFlashOn ? (
                <Zap className="w-6 h-6 text-white" />
              ) : (
                <ZapOff className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex justify-center items-end bg-gradient-to-t from-black/50 to-transparent">
          <div className="w-full max-w-md flex items-center justify-center space-x-6">
            {/* Gallery Upload */}
            <label className="p-4 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-colors cursor-pointer">
              <Image className="w-6 h-6 text-white" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>

            {/* Capture Button */}
            <button
              onClick={captureImage}
              disabled={!stream || isCapturing}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 relative"
            >
              <Camera className="w-8 h-8 text-black" />
              {stream && !isCapturing && (
                <motion.div
                  className="absolute inset-0 border-2 border-white rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </button>

            {/* Spacer for alignment */}
            <div className="w-14" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraComponent;