import express from 'express';
import { upload } from '../middleware/upload';
import { detectionTestService } from '../services/detectionTestService';
import { LoggerService } from '../services/loggerService';

const router = express.Router();

router.post('/detection-test', upload.array('images'), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        success: false,
        error: 'No test images provided'
      });
    }

    const results = await detectionTestService.runDetectionTests(req.files);
    
    // Get improvement suggestions based on quality issues
    const suggestions = await detectionTestService.getSuggestedImprovements(
      results.qualityIssues
    );

    res.json({
      success: true,
      data: {
        ...results,
        suggestions
      }
    });
  } catch (error) {
    LoggerService.logAPIError('testing.detectionTest', error as Error);
    res.status(500).json({
      success: false,
      error: 'Failed to run detection tests'
    });
  }
});

export default router;