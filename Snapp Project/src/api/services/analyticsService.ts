import { PrismaClient } from '@prisma/client';
import { CacheService } from './cacheService';
import { LoggerService } from './loggerService';

const prisma = new PrismaClient();
const cache = new CacheService();

export class AnalyticsService {
  private readonly TRENDING_CACHE_KEY = 'trending_products';
  private readonly TRENDING_TTL = 3600; // 1 hour
  private readonly TRENDING_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  async trackSearch(data: {
    userId: string;
    query?: string;
    imageId?: string;
    category?: string;
    matchCount: number;
    successful: boolean;
  }) {
    try {
      await prisma.searchLog.create({
        data: {
          userId: data.userId,
          query: data.query,
          imageId: data.imageId,
          category: data.category,
          matchCount: data.matchCount,
          successful: data.successful
        }
      });
    } catch (error) {
      LoggerService.logAPIError('trackSearch', error as Error);
    }
  }

  async trackProductView(data: {
    userId: string;
    productId: string;
    source: 'search' | 'trending' | 'similar';
  }) {
    try {
      await prisma.productView.create({
        data: {
          userId: data.userId,
          productId: data.productId,
          source: data.source
        }
      });
    } catch (error) {
      LoggerService.logAPIError('trackProductView', error as Error);
    }
  }

  async getTrendingProducts(category?: string) {
    try {
      // Try to get from cache first
      const cacheKey = category 
        ? `${this.TRENDING_CACHE_KEY}:${category}`
        : this.TRENDING_CACHE_KEY;
      
      const cached = await cache.get(cacheKey);
      if (cached) return cached;

      // Calculate trending products
      const trending = await this.calculateTrendingProducts(category);
      
      // Cache results
      await cache.set(cacheKey, trending, this.TRENDING_TTL);
      
      return trending;
    } catch (error) {
      LoggerService.logAPIError('getTrendingProducts', error as Error);
      return [];
    }
  }

  private async calculateTrendingProducts(category?: string) {
    const timeWindow = new Date(Date.now() - this.TRENDING_WINDOW);

    // Get product views within time window
    const views = await prisma.productView.groupBy({
      by: ['productId'],
      where: {
        createdAt: { gte: timeWindow },
        ...(category && {
          product: { category }
        })
      },
      _count: true,
      orderBy: {
        _count: {
          productId: 'desc'
        }
      },
      take: 20
    });

    // Get full product details
    const productIds = views.map(v => v.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      include: {
        stores: true
      }
    });

    // Calculate trend score and sort
    const trending = products.map(product => {
      const viewCount = views.find(v => v.productId === product.id)?._count || 0;
      const trendScore = this.calculateTrendScore(viewCount, product.createdAt);
      
      return {
        ...product,
        trendScore,
        viewCount
      };
    }).sort((a, b) => b.trendScore - a.trendScore);

    return trending;
  }

  private calculateTrendScore(viewCount: number, createdAt: Date): number {
    const hoursSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
    // Decay factor reduces score for older items
    const decayFactor = 1 / (1 + Math.log10(hoursSinceCreation + 1));
    return viewCount * decayFactor;
  }

  async getPopularCategories() {
    try {
      const timeWindow = new Date(Date.now() - this.TRENDING_WINDOW);

      return await prisma.searchLog.groupBy({
        by: ['category'],
        where: {
          category: { not: null },
          createdAt: { gte: timeWindow }
        },
        _count: true,
        orderBy: {
          _count: {
            category: 'desc'
          }
        },
        take: 5
      });
    } catch (error) {
      LoggerService.logAPIError('getPopularCategories', error as Error);
      return [];
    }
  }

  async getUserInsights(userId: string) {
    try {
      const searches = await prisma.searchLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const views = await prisma.productView.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      return {
        recentSearches: searches,
        recentViews: views
      };
    } catch (error) {
      LoggerService.logAPIError('getUserInsights', error as Error);
      return null;
    }
  }
}