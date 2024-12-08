// Environment variables accessible in the browser
export const env = {
  AWS_REGION: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  AWS_S3_BUCKET: import.meta.env.VITE_AWS_S3_BUCKET || ''
};