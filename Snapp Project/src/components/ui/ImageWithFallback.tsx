import React from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  loadingBlur?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackText,
  loadingBlur = true,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && loadingBlur && (
        <div className="absolute inset-0 bg-gray-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-6 h-6 text-gray-400" />
            </motion.div>
          </div>
        </div>
      )}
      
      {!error ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
          <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">{fallbackText || 'Image not available'}</span>
        </div>
      )}
    </div>
  );
}