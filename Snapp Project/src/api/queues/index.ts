import { Queue } from 'bullmq';
import { redisConnection } from '../services/redis';

// Queue for image processing tasks
export const imageProcessingQueue = new Queue('image-processing', {
  connection: redisConnection
});

// Queue for product matching tasks
export const productMatchingQueue = new Queue('product-matching', {
  connection: redisConnection
});

// Queue for store data fetching
export const storeDataQueue = new Queue('store-data', {
  connection: redisConnection
});

// Queue for notifications
export const notificationQueue = new Queue('notifications', {
  connection: redisConnection
});

// Queue for analytics processing
export const analyticsQueue = new Queue('analytics', {
  connection: redisConnection
});