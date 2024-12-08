export interface ErrorState {
  type: 'camera' | 'scanning' | 'results';
  code: string;
  message: string;
  suggestion?: string;
}

export const ERROR_MESSAGES = {
  camera: {
    permission_denied: {
      message: 'Camera access was denied',
      suggestion: 'Please allow camera access or use the upload option instead'
    },
    not_supported: {
      message: 'Camera not supported on this device',
      suggestion: 'Try using a different device or upload an image'
    },
    initialization_failed: {
      message: 'Could not start camera',
      suggestion: 'Please try again or use image upload'
    }
  },
  scanning: {
    low_quality: {
      message: 'Image quality too low',
      suggestion: 'Try taking the photo in better lighting'
    },
    not_recognized: {
      message: 'Could not recognize clothing item',
      suggestion: 'Make sure the item is clearly visible and centered'
    },
    connection_failed: {
      message: 'Connection lost',
      suggestion: 'Check your internet connection and try again'
    }
  },
  results: {
    no_matches: {
      message: 'No similar items found',
      suggestion: 'Try adjusting filters or search for a different item'
    },
    store_unavailable: {
      message: 'Some store links unavailable',
      suggestion: 'View alternative options from other stores'
    }
  }
};