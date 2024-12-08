import express from 'express';
import { abTestingService } from '../services/abTestingService';
import { LoggerService } from '../services/loggerService';

const router = express.Router();

router.get('/group/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const group = await abTestingService.assignUserToGroup(userId);
    
    res.json({
      success: true,
      data: group
    });
  } catch (error) {
    LoggerService.logAPIError('abTesting.getGroup', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign test group'
    });
  }
});

router.post('/track', async (req, res) => {
  try {
    const { userId, groupId, type, value } = req.body;
    
    await abTestingService.trackMetric({
      userId,
      groupId,
      type,
      value
    });

    res.json({ success: true });
  } catch (error) {
    LoggerService.logAPIError('abTesting.track', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to track metric'
    });
  }
});

router.get('/results', async (req, res) => {
  try {
    const { timeframe } = req.query;
    const results = await abTestingService.getTestResults(
      timeframe as '24h' | '7d' | '30d'
    );
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    LoggerService.logAPIError('abTesting.results', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test results'
    });
  }
});

export default router;