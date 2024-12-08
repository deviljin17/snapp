import { Job } from 'bullmq';
import { AnalyticsService } from '../../services/analyticsService';
import { LoggerService } from '../../services/loggerService';

const analyticsService = new AnalyticsService();

export async function processAnalytics(job: Job) {
  try {
    const { type, data } = job.data;

    switch (type) {
      case 'track-search':
        await analyticsService.trackSearch(data);
        break;
      
      case 'track-view':
        await analyticsService.trackProductView(data);
        break;
      
      case 'update-trending':
        await analyticsService.getTrendingProducts(data.category);
        break;
      
      default:
        throw new Error(`Unknown analytics type: ${type}`);
    }
  } catch (error) {
    LoggerService.logAPIError('analyticsProcessor', error as Error);
    throw error;
  }
}