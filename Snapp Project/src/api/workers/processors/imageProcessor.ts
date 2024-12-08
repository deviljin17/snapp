import { Job } from 'bullmq';
import { ImageProcessor } from '../../services/imageProcessor';
import { uploadToStorage } from '../../services/storageService';
import { LoggerService } from '../../services/loggerService';
import { productMatchingQueue } from '../../queues';

const processor = new ImageProcessor();

export async function processImage(job: Job) {
  try {
    const { file, options } = job.data;

    // Process image
    const processed = await processor.processImage(file, options);

    // Upload to cloud storage
    const imageUrl = await uploadToStorage(processed.buffer, {
      filename: processed.originalname,
      contentType: processed.mimetype
    });

    // Add to matching queue
    await productMatchingQueue.add('match-products', {
      imageUrl,
      features: processed.features
    });

    return { imageUrl };
  } catch (error) {
    LoggerService.logAPIError('imageProcessor', error as Error);
    throw error;
  }
}