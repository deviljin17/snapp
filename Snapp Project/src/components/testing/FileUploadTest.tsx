import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateImageData, simulateUploadProgress } from '@/utils/testHelpers';

interface FileUploadTestProps {
  onComplete: (success: boolean, error?: string) => void;
}

const FileUploadTest: React.FC<FileUploadTestProps> = ({ onComplete }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset input value to allow uploading the same file again
    e.target.value = '';

    setIsUploading(true);
    setError(null);

    try {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Please upload an image file (JPG, PNG)');
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Read file data
      const buffer = await file.arrayBuffer();
      const validationError = validateImageData(buffer);
      
      if (validationError) {
        throw new Error(validationError.message);
      }

      // Simulate upload with progress
      await simulateUploadProgress((progress) => {
        // Update progress here if needed
      });
      
      onComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      onComplete(false, err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          {isUploading ? (
            <div className="animate-pulse">
              <Upload className="w-8 h-8 text-gray-400 mb-2 animate-bounce" />
            </div>
          ) : (
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
          )}
          <span className="text-sm text-gray-600">
            {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            <span className="block text-xs text-gray-500">
              Supported: JPG, PNG (max 5MB)
            </span>
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </label>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-md p-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadTest;