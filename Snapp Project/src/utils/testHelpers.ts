export interface TestError {
  code: string;
  message: string;
  details?: string;
}

export const simulateNetworkError = async (): Promise<void> => {
  if (Math.random() < 0.1) {
    throw new Error('Network connection failed');
  }
};

export const simulateUploadProgress = async (
  onProgress: (progress: number) => void
): Promise<void> => {
  let progress = 0;
  const increment = 10;
  const interval = 200;

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      progress += increment;
      onProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(timer);
        resolve();
      }
      
      // Simulate random upload errors
      if (Math.random() < 0.05) {
        clearInterval(timer);
        reject(new Error('Upload failed - Please try again'));
      }
    }, interval);
  });
};
export const simulateTimeout = async (ms: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      if (Math.random() < 0.05) {
        reject(new Error('Operation timed out'));
      } else {
        resolve();
      }
    }, ms);
  });
};

export const validateImageData = (imageData: ArrayBuffer): TestError | null => {
  // Simulate image validation
  if (imageData.byteLength < 100) {
    return {
      code: 'INVALID_IMAGE',
      message: 'Image data is invalid or corrupted',
      details: 'The image file appears to be incomplete or corrupted'
    };
  }
  return null;
};

export const checkConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    await fetch('https://www.google.com', { 
      method: 'HEAD',
      signal: controller.signal 
    });
    
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
};