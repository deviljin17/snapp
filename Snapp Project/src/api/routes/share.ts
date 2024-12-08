import express from 'express';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { LoggerService } from '../services/loggerService';
import { CacheService } from '../services/cacheService';

const router = express.Router();
const prisma = new PrismaClient();
const cache = new CacheService();

// Generate shareable link
router.post('/generate', async (req, res) => {
  try {
    const { title, description, imageUrl, matches } = req.body;

    // Generate unique share ID
    const shareId = nanoid(10);

    // Store share data
    await prisma.shareLink.create({
      data: {
        id: shareId,
        title,
        description,
        imageUrl,
        matches: matches || [],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    // Generate shareable URL
    const shareUrl = `${process.env.APP_URL}/share/${shareId}`;

    // Cache share data
    await cache.set(`share:${shareId}`, {
      title,
      description,
      imageUrl,
      matches
    }, 86400); // 24 hours

    res.json({
      success: true,
      url: shareUrl
    });
  } catch (error) {
    LoggerService.logAPIError('share.generate', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate share link'
    });
  }
});

// Get share data
router.get('/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;

    // Try cache first
    const cached = await cache.get(`share:${shareId}`);
    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // Get from database
    const shareData = await prisma.shareLink.findUnique({
      where: { id: shareId }
    });

    if (!shareData) {
      return res.status(404).json({
        success: false,
        error: 'Share link not found or expired'
      });
    }

    // Cache the result
    await cache.set(`share:${shareId}`, shareData, 86400);

    res.json({
      success: true,
      data: shareData
    });
  } catch (error) {
    LoggerService.logAPIError('share.get', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch share data'
    });
  }
});

export default router;