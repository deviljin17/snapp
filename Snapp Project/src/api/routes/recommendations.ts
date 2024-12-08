import express from 'express';
import { recommendationService } from '../services/recommendationService';
import { frequentlyBoughtService } from '../services/frequentlyBoughtService';
import { LoggerService } from '../services/loggerService';

const router = express.Router();

router.get('/frequently-bought/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const recommendations = await frequentlyBoughtService.getFrequentlyBoughtTogether(productId);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    LoggerService.logAPIError('recommendations.frequentlyBought', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch frequently bought items'
    });
  }
});

export default router;