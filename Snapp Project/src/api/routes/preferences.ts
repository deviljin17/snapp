import express from 'express';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../services/loggerService';

const router = express.Router();
const prisma = new PrismaClient();

// Get user preferences
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const preferences = await prisma.userPreference.findUnique({
      where: { userId }
    });

    if (!preferences) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    LoggerService.logAPIError('preferences.get', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch preferences'
    });
  }
});

// Update user preferences
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      brands,
      categories,
      colors,
      minPrice,
      maxPrice,
      stores,
      sizePrefs
    } = req.body;

    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        brands,
        categories,
        colors,
        minPrice,
        maxPrice,
        stores,
        sizePrefs
      },
      create: {
        userId,
        brands: brands || [],
        categories: categories || [],
        colors: colors || [],
        minPrice,
        maxPrice,
        stores: stores || [],
        sizePrefs: sizePrefs || {}
      }
    });

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    LoggerService.logAPIError('preferences.update', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
});

// Add favorite product
router.post('/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    const favorite = await prisma.userFavorite.create({
      data: {
        userId,
        productId
      },
      include: {
        product: true
      }
    });

    res.json({
      success: true,
      data: favorite
    });
  } catch (error) {
    LoggerService.logAPIError('preferences.addFavorite', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to add favorite'
    });
  }
});

// Get user favorites
router.get('/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    LoggerService.logAPIError('preferences.getFavorites', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites'
    });
  }
});

export default router;