import { Job } from 'bullmq';
import { StoreService } from '../../services/storeService';
import { LoggerService } from '../../services/loggerService';

const storeService = new StoreService();

export async function fetchStoreData(job: Job) {
  try {
    const { productId, name } = job.data;

    // Find best prices across stores
    const storeData = await storeService.findBestPrices(name);

    return { productId, storeData };
  } catch (error) {
    LoggerService.logAPIError('storeFetcher', error as Error);
    throw error;
  }
}