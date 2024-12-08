import React, { useState } from 'react';
import { Upload, X, Search } from 'lucide-react';
import { validateFile } from '../utils/fileHelpers';

interface ImagePreview {
  url: string;
  file: File;
}

const ImageSearch: React.FC = () => {
  const [preview, setPreview] = useState<ImagePreview | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setPreview({
      url: URL.createObjectURL(file),
      file
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
      setError(null);
    }
  };

  const searchSimilarItems = async () => {
    if (!preview) return;
    
    setIsSearching(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSearching(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Find Your Style</h2>
        <p className="text-gray-600 text-center">
          Upload any clothing image and we'll help you find similar items
        </p>
        
        <div className="w-full">
          {!preview ? (
            <label
              className="flex flex-col items-center justify-center w-full h-80 border-2 border-indigo-200 border-dashed rounded-xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 transition-colors relative"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-indigo-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                {error && (
                  <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    {error}
                  </p>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileInput}
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview.url}
                alt="Preview"
                className="w-full h-80 object-cover rounded-xl"
              />
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={searchSimilarItems}
                disabled={isSearching}
                className="absolute bottom-4 right-4 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-75"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? 'Searching...' : 'Find Similar'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSearch;