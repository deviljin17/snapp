import { PrismaClient } from '@prisma/client';
import { createLogger, format, transports } from 'winston';

const prisma = new PrismaClient();

// Create Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'snapp-api' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

export class LoggerService {
  static async logUpload(userId: string, imageUrl: string, success: boolean, error?: string) {
    try {
      await prisma.uploadLog.create({
        data: {
          userId,
          imageUrl,
          success,
          error
        }
      });

      logger.info('Image upload', {
        userId,
        imageUrl,
        success,
        error
      });
    } catch (err) {
      logger.error('Failed to log upload', { error: err });
    }
  }

  static async logDetection(userId: string, detectionId: string, items: any[], success: boolean, error?: string) {
    try {
      await prisma.detectionLog.create({
        data: {
          userId,
          detectionId,
          itemCount: items.length,
          success,
          error
        }
      });

      logger.info('Item detection', {
        userId,
        detectionId,
        itemCount: items.length,
        success,
        error
      });
    } catch (err) {
      logger.error('Failed to log detection', { error: err });
    }
  }

  static async logAPIError(endpoint: string, error: Error, userId?: string) {
    try {
      await prisma.errorLog.create({
        data: {
          endpoint,
          errorMessage: error.message,
          errorStack: error.stack,
          userId
        }
      });

      logger.error('API Error', {
        endpoint,
        error: error.message,
        stack: error.stack,
        userId
      });
    } catch (err) {
      logger.error('Failed to log API error', { error: err });
    }
  }

  static async logStoreError(store: string, productUrl: string, error: Error) {
    try {
      await prisma.storeErrorLog.create({
        data: {
          store,
          productUrl,
          errorMessage: error.message,
          errorStack: error.stack
        }
      });

      logger.error('Store Error', {
        store,
        productUrl,
        error: error.message,
        stack: error.stack
      });
    } catch (err) {
      logger.error('Failed to log store error', { error: err });
    }
  }
}