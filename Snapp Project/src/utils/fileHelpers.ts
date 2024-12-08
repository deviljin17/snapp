const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateFile = (file: File): string | null => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Please upload a PNG, JPG, or WEBP file';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 5MB';
  }
  
  return null;
};