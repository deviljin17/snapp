export const checkImageQuality = async (imageBlob: Blob): Promise<{ isValid: boolean; issues?: string[] }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const issues: string[] = [];
    
    img.onload = () => {
      // Check dimensions
      if (img.width < 640 || img.height < 640) {
        issues.push('Image resolution is too low for best results');
      }

      // Check aspect ratio
      const ratio = img.width / img.height;
      if (ratio < 0.5 || ratio > 2) {
        issues.push('Image aspect ratio is not optimal');
      }

      // File size check (max 5MB)
      if (imageBlob.size > 5 * 1024 * 1024) {
        issues.push('File size exceeds 5MB limit');
      }

      resolve({
        isValid: issues.length === 0,
        issues: issues.length > 0 ? issues : undefined
      });
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        issues: ['Failed to analyze image quality']
      });
    };

    img.src = URL.createObjectURL(imageBlob);
  });
};

export const compressImage = async (blob: Blob, maxSizeMB: number = 1): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      // Scale down if needed while maintaining aspect ratio
      const maxDimension = 2048;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // Start with high quality
      let quality = 0.9;
      const tryCompress = () => {
        canvas.toBlob(
          (compressedBlob) => {
            if (!compressedBlob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            if (compressedBlob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
              resolve(compressedBlob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(blob);
  });
};