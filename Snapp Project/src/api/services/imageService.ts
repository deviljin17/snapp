import sharp from 'sharp';
import { CLOTHING_CATEGORIES } from '../config';

export interface ProcessedImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export async function processImage(file: Express.Multer.File): Promise<ProcessedImage> {
  // Optimize image
  const processedBuffer = await sharp(file.buffer)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  return {
    buffer: processedBuffer,
    mimetype: 'image/jpeg',
    originalname: file.originalname
  };
}

export async function analyzeImage(buffer: Buffer) {
  // Simulate clothing detection with confidence scores
  const detectedItems = CLOTHING_CATEGORIES.filter(() => Math.random() > 0.7)
    .map(category => ({
      label: category,
      confidence: Math.round(Math.random() * 30 + 70), // 70-100%
      boundingBox: {
        left: Math.random() * 0.8,
        top: Math.random() * 0.8,
        width: Math.random() * 0.2 + 0.1,
        height: Math.random() * 0.2 + 0.1
      }
    }));

  return {
    items: detectedItems,
    timestamp: new Date().toISOString()
  };
}