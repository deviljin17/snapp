import { PrismaClient } from '@prisma/client';
import { LoggerService } from './loggerService';
import { CacheService } from './cacheService';

const prisma = new PrismaClient();
const cache = new CacheService();

interface TestGroup {
  id: string;
  name: string;
  description: string;
  algorithm: 'exact_match' | 'similarity';
  weight: number;
}

interface TestMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export class ABTestingService {
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly TEST_GROUPS: TestGroup[] = [
    {
      id: 'A',
      name: 'Exact Match Priority',
      description: 'Prioritizes exact brand and style matches',
      algorithm: 'exact_match',
      weight: 0.5
    },
    {
      id: 'B',
      name: 'Similarity Based',
      description: 'Ranks by visual similarity score',
      algorithm: 'similarity',
      weight: 0.5
    }
  ];

  async assignUserToGroup(userId: string): Promise<TestGroup> {
    const cacheKey = `ab_group:${userId}`;
    
    // Check cache first
    const cached = await cache.get<TestGroup>(cacheKey);
    if (cached) return cached;

    try {
      // Check if user already has an assignment
      const existing = await prisma.userABTest.findUnique({
        where: { userId }
      });

      if (existing) {
        const group = this.TEST_GROUPS.find(g => g.id === existing.groupId);
        if (group) {
          await cache.set(cacheKey, group, this.CACHE_TTL);
          return group;
        }
      }

      // Assign to new group based on weights
      const group = this.assignRandomGroup();
      
      await prisma.userABTest.create({
        data: {
          userId,
          groupId: group.id,
          assignedAt: new Date()
        }
      });

      await cache.set(cacheKey, group, this.CACHE_TTL);
      return group;
    } catch (error) {
      LoggerService.logAPIError('abTesting.assignGroup', error as Error);
      // Default to group A on error
      return this.TEST_GROUPS[0];
    }
  }

  private assignRandomGroup(): TestGroup {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const group of this.TEST_GROUPS) {
      cumulativeWeight += group.weight;
      if (random <= cumulativeWeight) {
        return group;
      }
    }
    
    return this.TEST_GROUPS[0];
  }

  async trackMetric(data: {
    userId: string;
    groupId: string;
    type: 'impression' | 'click' | 'conversion';
    value?: number;
  }) {
    try {
      await prisma.abTestMetric.create({
        data: {
          userId: data.userId,
          groupId: data.groupId,
          type: data.type,
          value: data.value,
          timestamp: new Date()
        }
      });
    } catch (error) {
      LoggerService.logAPIError('abTesting.trackMetric', error as Error);
    }
  }

  async getTestResults(timeframe: '24h' | '7d' | '30d' = '7d'): Promise<{
    groups: Record<string, TestMetrics>;
    winner?: string;
    confidence: number;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe));

      const metrics = await prisma.abTestMetric.groupBy({
        by: ['groupId', 'type'],
        where: {
          timestamp: { gte: startDate }
        },
        _count: true,
        _sum: {
          value: true
        }
      });

      // Calculate metrics for each group
      const results: Record<string, TestMetrics> = {};
      
      this.TEST_GROUPS.forEach(group => {
        results[group.id] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        };
      });

      metrics.forEach(metric => {
        const group = results[metric.groupId];
        if (!group) return;

        switch (metric.type) {
          case 'impression':
            group.impressions = metric._count;
            break;
          case 'click':
            group.clicks = metric._count;
            break;
          case 'conversion':
            group.conversions = metric._count;
            group.revenue = metric._sum.value || 0;
            break;
        }
      });

      // Calculate statistical significance
      const { winner, confidence } = this.calculateSignificance(results);

      return { groups: results, winner, confidence };
    } catch (error) {
      LoggerService.logAPIError('abTesting.getResults', error as Error);
      throw error;
    }
  }

  private calculateSignificance(results: Record<string, TestMetrics>): {
    winner?: string;
    confidence: number;
  } {
    const groups = Object.entries(results);
    if (groups.length !== 2) return { confidence: 0 };

    const [groupA, groupB] = groups;
    const conversionRateA = groupA[1].conversions / groupA[1].impressions;
    const conversionRateB = groupB[1].conversions / groupB[1].impressions;

    // Calculate z-score
    const pooledStdErr = Math.sqrt(
      (conversionRateA * (1 - conversionRateA) / groupA[1].impressions) +
      (conversionRateB * (1 - conversionRateB) / groupB[1].impressions)
    );

    const zScore = Math.abs(conversionRateA - conversionRateB) / pooledStdErr;
    const confidence = this.zScoreToConfidence(zScore);

    // Require 95% confidence for a winner
    if (confidence >= 0.95) {
      return {
        winner: conversionRateA > conversionRateB ? groupA[0] : groupB[0],
        confidence
      };
    }

    return { confidence };
  }

  private zScoreToConfidence(zScore: number): number {
    // Approximate conversion of z-score to confidence level
    return Math.min(0.9999, Math.erf(zScore / Math.sqrt(2)));
  }
}

export const abTestingService = new ABTestingService();