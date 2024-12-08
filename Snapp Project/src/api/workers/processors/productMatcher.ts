import { Job } from 'bullmq';
import { findSimilarProducts } from '../../services/similaritySearch';
import { storeDataQueue } from '../../queues';
import { LoggerService } from '../../services/loggerService';

export async function matchProducts(job: Job) {
  try {
    const { features, category, brand } = job.data;

    // Find similar products
    const matches = await findSimilarProducts(features, category, brand);

    // Sort matches to prioritize exact brand matches
    matches.sort((a, b) => {
      if (a.exactBrandMatch && !b.exactBrandMatch) return -1;
      if (!a.exactBrandMatch && b.exactBrandMatch) return 1;
      return b.similarity - a.similarity;
    });

    // Queue store data fetching for each match
    await Promise.all(
      matches.map(match =>
        storeDataQueue.add('fetch-store-data', {
          productId: match.id,
          name: match.metadata.name
        })
      )
    );

    return { matches };
  } catch (error) {
    LoggerService.logAPIError('productMatcher', error as Error);
    throw error;
  }
}