import { Job } from 'bullmq';
import { NotificationService } from '../../services/notificationService';
import { LoggerService } from '../../services/loggerService';

const notificationService = new NotificationService();

export async function processNotifications(job: Job) {
  try {
    const { type, data } = job.data;

    switch (type) {
      case 'price-alert':
        await notificationService.checkWishlistAlerts();
        break;
      
      case 'back-in-stock':
        await notificationService.checkStock(data.productId);
        break;
      
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  } catch (error) {
    LoggerService.logAPIError('notificationProcessor', error as Error);
    throw error;
  }
}