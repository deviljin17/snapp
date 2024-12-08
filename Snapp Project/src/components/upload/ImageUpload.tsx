import React, { useState } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/logger';

interface ImageUploadProps {
  onUploadComplete?: (imageUrl: string) => void;
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, or WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(Math.round(progress));
          }
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { imageUrl } = await response.json();
      
      logger.info('upload', 'Image uploaded successfully', { imageUrl });
      
      if (onUploadComplete) {
        onUploadComplete(imageUrl);
      }
      
      navigate('/scanning');
    } catch (err) {
      logger.error('upload', 'Upload failed', { error: err });
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 ${
          isUploading ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-400'
        } transition-colors`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
          id="file-upload"
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
              <p className="text-indigo-600 font-medium">Uploading... {uploadProgress}%</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center gap-4">
                <label
                  htmlFor="file-upload"
                  className="p-4 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="w-6 h-6" />
                </label>
                <button
                  onClick={() => navigate('/camera')}
                  className="p-4 bg-black text-white rounded-full hover:bg-gray-900 transition-colors"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600">
                Click to upload or drag and drop
                <br />
                <span className="text-sm text-gray-500">
                  JPG, PNG or WEBP (max. 5MB)
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-16 left-0 right-0 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-2"
            >
              <X className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}