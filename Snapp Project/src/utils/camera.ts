export const checkCameraSupport = async (): Promise<{ supported: boolean; error?: string }> => {
  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      error: 'Camera API not supported in this browser'
    };
  }
  return { supported: true };
};

export const requestCameraPermission = async (): Promise<{
  granted: boolean;
  stream?: MediaStream;
  error?: string;
}> => {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return { granted: true, stream };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to access camera';
    return { granted: false, error };
  }
};