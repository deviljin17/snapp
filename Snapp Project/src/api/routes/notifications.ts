import express from 'express';
import { PrismaClient, AlertType } from '@prisma/client';
import { notificationService } from '../services/notificationService';
import { LoggerService } from '../services/loggerService';

const router = express.Router();
const prisma = new PrismaClient();

// Create wishlist alert
router.post('/alerts', async (req, res) => {
  try {
    const { favoriteId, type, targetPrice } = req.body;

    const alert = await prisma.wishlistAlert.create({
      data: {
        favoriteId,
        type: type as AlertType,
        targetPrice,
        active: true
      },
      include: {
        favorite: {
          include: {
            product: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    LoggerService.logAPIError('alerts.create', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to create alert'
    });
  }
});

// Get user's notifications
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { unreadOnly, limit, offset } = req.query;

    const notifications = await notificationService.getUserNotifications(userId, {
      unreadOnly: unreadOnly === 'true',
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    LoggerService.logAPIError('notifications.get', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await notificationService.markNotificationAsRead(notificationId);

    res.json({
      success: true
    });
  } catch (error) {
    LoggerService.logAPIError('notifications.markRead', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
});

// Update alert settings
router.put('/alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { active, targetPrice } = req.body;

    const alert = await prisma.wishlistAlert.update({
      where: { id: alertId },
      data: {
        active,
        targetPrice
      }
    });

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    LoggerService.logAPIError('alerts.update', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to update alert'
    });
  }
});

export default router;