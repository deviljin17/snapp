import express from 'express';
import { MonitoringService } from '../services/monitoringService';
import { LoggerService } from '../services/loggerService';

const router = express.Router();
const monitoring = new MonitoringService();

// Performance monitoring middleware
router.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    monitoring.trackEndpointPerformance({
      endpoint: req.path,
      method: req.method,
      duration,
      status: res.statusCode,
      timestamp: new Date()
    }).catch(console.error);
  });
  
  next();
});

// Get system health metrics
router.get('/health', async (req, res) => {
  try {
    const [system, cache] = await Promise.all([
      monitoring.getSystemMetrics(),
      monitoring.getCacheMetrics()
    ]);

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date(),
        metrics: {
          system,
          cache
        }
      }
    });
  } catch (error) {
    LoggerService.logAPIError('monitoring.health', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health metrics'
    });
  }
});

// Get detailed performance metrics
router.get('/performance', async (req, res) => {
  try {
    const { timeframe = '1h' } = req.query;
    
    // Calculate time window
    const now = new Date();
    const timeWindows = {
      '1h': new Date(now.getTime() - 60 * 60 * 1000),
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    };

    const startTime = timeWindows[timeframe as keyof typeof timeWindows] || timeWindows['1h'];

    const metrics = await prisma.performanceLog.groupBy({
      by: ['endpoint'],
      where: {
        timestamp: { gte: startTime }
      },
      _avg: {
        duration: true
      },
      _count: true,
      orderBy: {
        _avg: {
          duration: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: {
        timeframe,
        metrics
      }
    });
  } catch (error) {
    LoggerService.logAPIError('monitoring.performance', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics'
    });
  }
});

export default router;