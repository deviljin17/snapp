import { PrismaClient } from '@prisma/client';
import { LoggerService } from './loggerService';

const prisma = new PrismaClient();

export class UserFeedbackService {
  async logManualBrandInput(data: {
    userId: string;
    detectionId: string;
    originalBrand: string | null;
    manualBrand: string;
    confidence: number;
  }) {
    try {
      await prisma.detectionLog.create({
        data: {
          userId: data.userId,
          detectionId: data.detectionId,
          itemCount: 1,
          success: true,
          metadata: {
            type: 'brand_override',
            originalBrand: data.originalBrand,
            manualBrand: data.manualBrand,
            confidence: data.confidence
          }
        }
      });
    } catch (error) {
      LoggerService.logAPIError('userFeedback.logManualBrand', error as Error);
    }
  }

  async logFailedDetection(data: {
    userId: string;
    detectionId: string;
    imageQuality: {
      lighting?: number;
      blur?: number;
      visibility?: number;
    };
    error: string;
  }) {
    try {
      await prisma.detectionLog.create({
        data: {
          userId: data.userId,
          detectionId: data.detectionId,
          itemCount: 0,
          success: false,
          error: data.error,
          metadata: {
            type: 'failed_detection',
            imageQuality: data.imageQuality
          }
        }
      });
    } catch (error) {
      LoggerService.logAPIError('userFeedback.logFailedDetection', error as Error);
    }
  }

  async logFilterUsage(data: {
    userId: string;
    filters: {
      category?: string;
      color?: string;
      brand?: string;
      priceRange?: [number, number];
      sustainability?: string[];
    };
    resultCount: number;
  }) {
    try {
      await prisma.searchLog.create({
        data: {
          userId: data.userId,
          matchCount: data.resultCount,
          successful: true,
          metadata: {
            type: 'filter_usage',
            filters: data.filters
          }
        }
      });
    } catch (error) {
      LoggerService.logAPIError('userFeedback.logFilterUsage', error as Error);
    }
  }

  async getCommonPatterns() {
    try {
      // Analyze failed detections
      const failedDetections = await prisma.detectionLog.findMany({
        where: {
          success: false,
          timestamp: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        select: {
          error: true,
          metadata: true
        }
      });

      // Analyze filter usage
      const filterUsage = await prisma.searchLog.groupBy({
        by: ['metadata'],
        where: {
          metadata: {
            path: ['type'],
            equals: 'filter_usage'
          }
        },
        _count: true
      });

      // Analyze brand overrides
      const brandOverrides = await prisma.detectionLog.findMany({
        where: {
          metadata: {
            path: ['type'],
            equals: 'brand_override'
          }
        },
        select: {
          metadata: true
        }
      });

      return {
        failedDetections: this.analyzeFailedDetections(failedDetections),
        popularFilters: this.analyzeFilterUsage(filterUsage),
        brandOverrides: this.analyzeBrandOverrides(brandOverrides)
      };
    } catch (error) {
      LoggerService.logAPIError('userFeedback.getCommonPatterns', error as Error);
      throw error;
    }
  }

  private analyzeFailedDetections(detections: any[]) {
    const issues: Record<string, number> = {};
    const qualityIssues: Record<string, number> = {};

    detections.forEach(detection => {
      // Count error types
      if (detection.error) {
        issues[detection.error] = (issues[detection.error] || 0) + 1;
      }

      // Analyze image quality issues
      if (detection.metadata?.imageQuality) {
        Object.entries(detection.metadata.imageQuality).forEach(([issue, value]) => {
          if (value < 0.5) { // Consider it an issue if score is below 0.5
            qualityIssues[issue] = (qualityIssues[issue] || 0) + 1;
          }
        });
      }
    });

    return {
      commonErrors: issues,
      qualityIssues
    };
  }

  private analyzeFilterUsage(filterUsage: any[]) {
    const filterCounts: Record<string, number> = {};

    filterUsage.forEach(usage => {
      const filters = usage.metadata?.filters || {};
      Object.keys(filters).forEach(filter => {
        filterCounts[filter] = (filterCounts[filter] || 0) + 1;
      });
    });

    return filterCounts;
  }

  private analyzeBrandOverrides(overrides: any[]) {
    const brandMismatches: Record<string, number> = {};

    overrides.forEach(override => {
      const original = override.metadata?.originalBrand;
      const manual = override.metadata?.manualBrand;
      if (original && manual) {
        const key = `${original}->${manual}`;
        brandMismatches[key] = (brandMismatches[key] || 0) + 1;
      }
    });

    return brandMismatches;
  }
}

export const userFeedbackService = new UserFeedbackService();