import { PrismaClient } from '@prisma/client';
import { CacheService } from './cacheService';
import { LoggerService } from './loggerService';

const prisma = new PrismaClient();
const cache = new CacheService();

export class FrequentlyBoughtService {
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly MIN_CONFIDENCE = 0.3;

  async getFrequentlyBoughtTogether(productId: string) {
    const cacheKey = `frequently_bought:${productId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    try {
      // Find orders containing the target product
      const orders = await prisma.productView.findMany({
        where: { productId },
        select: { userId: true }
      });

      if (orders.length === 0) return [];

      // Find other products viewed by these users
      const userIds = orders.map(o => o.userId);
      const relatedViews = await prisma.productView.findMany({
        where: {
          userId: { in: userIds },
          productId: { not: productId }
        },
        include: {
          product: true
        }
      });

      // Calculate confidence scores
      const productCounts = new Map<string, number>();
      relatedViews.forEach(view => {
        const count = productCounts.get(view.productId) || 0;
        productCounts.set(view.productId, count + 1);
      });

      const recommendations = Array.from(productCounts.entries())
        .map(([id, count]) => ({
          confidence: count / orders.length,
          product: relatedViews.find(v => v.productId === id)!.product
        }))
        .filter(rec => rec.confidence >= this.MIN_CONFIDENCE)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

      await cache.set(cacheKey, recommendations, this.CACHE_TTL);
      return recommendations;
    } catch (error) {
      LoggerService.logAPIError('getFrequentlyBoughtTogether', error as Error);
      return [];
    }
  }
}

export const frequentlyBoughtService = new FrequentlyBoughtService();