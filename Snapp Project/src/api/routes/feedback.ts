import express from 'express';
import { userFeedbackService } from '../services/userFeedbackService';
import { LoggerService } from '../services/loggerService';

const router = express.Router();

router.post('/brand-override', async (req, res) => {
  try {
    const {
      userId,
      detectionId,
      originalBrand,
      manualBrand,
      confidence
    } = req.body;

    await userFeedbackService.logManualBrandInput({
      userId,
      detectionId,
      originalBrand,
      manualBrand,
      confidence
    });

    res.json({ success: true });
  } catch (error) {
    LoggerService.logAPIError('feedback.brandOverride', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to log brand override'
    });
  }
});

router.post('/failed-detection', async (req, res) => {
  try {
    const {
      userId,
      detectionId,
      imageQuality,
      error
    } = req.body;

    await userFeedbackService.logFailedDetection({
      userId,
      detectionId,
      imageQuality,
      error
    });

    res.json({ success: true });
  } catch (error) {
    LoggerService.logAPIError('feedback.failedDetection', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to log detection failure'
    });
  }
});

router.post('/filter-usage', async (req, res) => {
  try {
    const {
      userId,
      filters,
      resultCount
    } = req.body;

    await userFeedbackService.logFilterUsage({
      userId,
      filters,
      resultCount
    });

    res.json({ success: true });
  } catch (error) {
    LoggerService.logAPIError('feedback.filterUsage', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to log filter usage'
    });
  }
});

router.get('/patterns', async (req, res) => {
  try {
    const patterns = await userFeedbackService.getCommonPatterns();
    
    res.json({
      success: true,
      data: patterns
    });
  } catch (error) {
    LoggerService.logAPIError('feedback.patterns', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage patterns'
    });
  }
});

export default router;