import { Worker } from 'bullmq';
import { redisConnection } from '../services/redis';
import { processImage } from './processors/imageProcessor';
import { matchProducts } from './processors/productMatcher';
import { fetchStoreData } from './processors/storeFetcher';
import { processNotifications } from './processors/notificationProcessor';
import { processAnalytics } from './processors/analyticsProcessor';
import { LoggerService } from '../services/loggerService';

// Image Processing Worker
const imageWorker = new Worker('image-processing', processImage, {
  connection: redisConnection,
  concurrency: 5
});

// Product Matching Worker
const matchingWorker = new Worker('product-matching', matchProducts, {
  connection: redisConnection,
  concurrency: 3
});

// Store Data Worker
const storeWorker = new Worker('store-data', fetchStoreData, {
  connection: redisConnection,
  concurrency: 2
});

// Notification Worker
const notificationWorker = new Worker('notifications', processNotifications, {
  connection: redisConnection,
  concurrency: 2
});

// Analytics Worker
const analyticsWorker = new Worker('analytics', processAnalytics, {
  connection: redisConnection,
  concurrency: 1
});

// Error handling for workers
[imageWorker, matchingWorker, storeWorker, notificationWorker, analyticsWorker]
  .forEach(worker => {
    worker.on('error', error => {
      LoggerService.logAPIError('worker', error);
    });

    worker.on('failed', (job, error) => {
      LoggerService.logAPIError(`worker.${job.name}`, error);
    });
  });