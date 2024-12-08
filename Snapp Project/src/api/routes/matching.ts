import express from 'express';
import { PrismaClient } from '@prisma/client';
import { extractFeatures } from '../services/featureExtractor';
import { recommendationService } from '../services/recommendationService';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/matches/:detectionId', async (req, res) => {
  try {
    const detectionResult = await prisma.detectionResult.findUnique({
      where: { id: req.params.detectionId },
      include: {
        items: {
          include: {
            matches: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!detectionResult) {
      return res.status(404).json({ error: 'Detection result not found' });
    }

    res.json({
      success: true,
      data: detectionResult
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch matches'
    });
  }
});

router.post('/find-similar', async (req, res) => {
  try {
    const { imageBuffer, category, userId } = req.body;

    // Extract features from the image
    const features = await extractFeatures(Buffer.from(imageBuffer));

    // Get personalized recommendations
    const similarProducts = await recommendationService.getPersonalizedResults(
      userId,
      features,
      category
    );

    // Update user preferences based on matches
    if (userId) {
      await recommendationService.updateUserPreferences(userId, category);
    }

    res.json({
      success: true,
      data: {
        matches: similarProducts
      }
    });
  } catch (error) {
    console.error('Error finding similar products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find similar products'
    });
  }
});

export default router;