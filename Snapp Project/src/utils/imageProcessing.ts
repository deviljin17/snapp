import { logger } from './logger';

interface ProcessedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export const processImage = async (
  imageData: Blob | File,
  options: ProcessingOptions = {}
): Promise<ProcessedImage> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  try {
    // Create image element to load the blob
    const img = new Image();
    const imageUrl = URL.createObjectURL(imageData);
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Calculate new dimensions while maintaining aspect ratio
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        `image/${format}`,
        quality
      );
    });

    logger.info('imageProcessing', 'Image processed successfully', {
      originalSize: imageData.size,
      processedSize: blob.size,
      dimensions: `${width}x${height}`
    });

    return {
      blob,
      url: URL.createObjectURL(blob),
      width,
      height
    };
  } catch (error) {
    logger.error('imageProcessing', 'Image processing failed', error);
    throw error;
  }
};

export const validateImage = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return 'Please upload a JPG, PNG, or WEBP image';
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return 'Image size must be less than 10MB';
  }

  return null;
};

export const revokeImageUrl = (url: string) => {
  URL.revokeObjectURL(url);
};