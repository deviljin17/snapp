import express from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { LoggerService } from '../services/loggerService';

const router = express.Router();
const analyticsService = new AnalyticsService();

// Track search
router.post('/track/search', async (req, res) => {
  try {
    const { userId, query, imageId, category, matchCount, successful } = req.body;
    
    await analyticsService.trackSearch({
      userId,
      query,
      imageId,
      category,
      matchCount,
      successful
    });

    res.json({ success: true });
  } catch (error) {
    LoggerService.logAPIError('analytics.trackSearch', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to track search'
    });
  }
});

// Track product view
router.post('/track/view', async (req, res) => {
  try {
    const { userId, productId, source } = req.body;
    
    await analyticsService.trackProductView({
      userId,
      productId,
      source
    });

    res.json({ success: true });
  } catch (error) {
    LoggerService.logAPIError('analytics.trackView', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to track product view'
    });
  }
});

// Get trending products
router.get('/trending', async (req, res) => {
  try {
    const { category } = req.query;
    const trending = await analyticsService.getTrendingProducts(
      category as string | undefined
    );

    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    LoggerService.logAPIError('analytics.trending', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending products'
    });
  }
});

// Get popular categories
router.get('/popular-categories', async (req, res) => {
  try {
    const categories = await analyticsService.getPopularCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    LoggerService.logAPIError('analytics.popularCategories', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular categories'
    });
  }
});

// Get user insights
router.get('/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const insights = await analyticsService.getUserInsights(userId);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    LoggerService.logAPIError('analytics.userInsights', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user insights'
    });
  }
});

export default router;