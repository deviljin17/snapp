import React, { useCallback } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageCapture } from '@/hooks/useImageCapture';

const ImageUpload = () => {
  const { image, error, isProcessing, handleFileUpload, clearImage } = useImageCapture();

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!image.url ? (
          <motion.label
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-200 border-dashed rounded-xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-4 text-indigo-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </motion.label>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <img
              src={image.url}
              alt="Preview"
              className="w-full h-64 object-contain rounded-xl bg-indigo-50"
            />
            {isProcessing ? (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            ) : (
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;