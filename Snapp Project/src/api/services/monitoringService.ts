import { createLogger, format, transports } from 'winston';
import { PrismaClient } from '@prisma/client';
import { CacheService } from './cacheService';
import { LoggerService } from './loggerService';

const prisma = new PrismaClient();
const cache = new CacheService();

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: Date;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  memory: number;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  errorRate: number;
}

export class MonitoringService {
  private readonly logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    defaultMeta: { service: 'monitoring' },
    transports: [
      new transports.File({ filename: 'logs/monitoring.log' })
    ]
  });

  private metrics: {
    performance: PerformanceMetrics[];
    errors: Error[];
    cacheStats: Map<string, number>;
  } = {
    performance: [],
    errors: [],
    cacheStats: new Map()
  };

  // Track API response times
  async trackEndpointPerformance(metrics: PerformanceMetrics) {
    try {
      this.metrics.performance.push(metrics);

      // Log slow responses (over 1 second)
      if (metrics.duration > 1000) {
        this.logger.warn('Slow API response', {
          ...metrics,
          type: 'performance_warning'
        });
      }

      // Store in database for analysis
      await prisma.performanceLog.create({
        data: {
          endpoint: metrics.endpoint,
          method: metrics.method,
          duration: metrics.duration,
          status: metrics.status
        }
      });

      // Check for performance degradation
      await this.checkPerformanceAlert(metrics);
    } catch (error) {
      LoggerService.logAPIError('trackEndpointPerformance', error as Error);
    }
  }

  // Monitor Redis cache performance
  async getCacheMetrics(): Promise<CacheMetrics> {
    try {
      const info = await cache.getInfo();
      
      const metrics = {
        hits: parseInt(info.keyspace_hits),
        misses: parseInt(info.keyspace_misses),
        hitRate: 0,
        size: parseInt(info.used_memory),
        memory: parseInt(info.used_memory_peak)
      };

      metrics.hitRate = metrics.hits / (metrics.hits + metrics.misses);

      // Alert on low hit rates
      if (metrics.hitRate < 0.5) {
        this.logger.warn('Low cache hit rate', {
          hitRate: metrics.hitRate,
          type: 'cache_warning'
        });
      }

      // Alert on high memory usage
      if (metrics.memory > 1024 * 1024 * 1024) { // 1GB
        this.logger.warn('High cache memory usage', {
          memory: metrics.memory,
          type: 'memory_warning'
        });
      }

      return metrics;
    } catch (error) {
      LoggerService.logAPIError('getCacheMetrics', error as Error);
      throw error;
    }
  }

  // Monitor system health
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const metrics = {
        cpuUsage: process.cpuUsage().user / 1000000, // Convert to seconds
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        activeConnections: await this.getActiveConnections(),
        errorRate: await this.calculateErrorRate()
      };

      // Alert on high resource usage
      if (metrics.cpuUsage > 80) {
        this.logger.warn('High CPU usage', {
          cpu: metrics.cpuUsage,
          type: 'system_warning'
        });
      }

      if (metrics.memoryUsage > 1024) { // 1GB
        this.logger.warn('High memory usage', {
          memory: metrics.memoryUsage,
          type: 'system_warning'
        });
      }

      if (metrics.errorRate > 0.05) { // 5% error rate
        this.logger.warn('High error rate', {
          errorRate: metrics.errorRate,
          type: 'error_warning'
        });
      }

      return metrics;
    } catch (error) {
      LoggerService.logAPIError('getSystemMetrics', error as Error);
      throw error;
    }
  }

  private async getActiveConnections(): Promise<number> {
    // Get active database connections
    const dbConnections = await prisma.$queryRaw`SELECT count(*) FROM pg_stat_activity`;
    return parseInt(dbConnections[0].count);
  }

  private async calculateErrorRate(): Promise<number> {
    const timeWindow = new Date(Date.now() - 5 * 60 * 1000); // Last 5 minutes

    const [errors, total] = await Promise.all([
      prisma.errorLog.count({
        where: { timestamp: { gte: timeWindow } }
      }),
      prisma.performanceLog.count({
        where: { timestamp: { gte: timeWindow } }
      })
    ]);

    return total > 0 ? errors / total : 0;
  }

  private async checkPerformanceAlert(metrics: PerformanceMetrics) {
    // Get average response time for this endpoint
    const avgResponse = await prisma.performanceLog.aggregate({
      where: { endpoint: metrics.endpoint },
      _avg: { duration: true }
    });

    // Alert if response time is significantly higher than average
    if (avgResponse._avg.duration && 
        metrics.duration > avgResponse._avg.duration * 2) {
      this.logger.warn('Response time spike detected', {
        endpoint: metrics.endpoint,
        current: metrics.duration,
        average: avgResponse._avg.duration,
        type: 'performance_alert'
      });
    }
  }
}