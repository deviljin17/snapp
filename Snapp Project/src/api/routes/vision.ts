import express from 'express';
import { PrismaClient } from '@prisma/client';
import { detectClothing } from '../services/visionService';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/detection/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { manualTags } = req.query;

    let result = await prisma.detectionResult.findUnique({
      where: { id: req.params.id },
      include: { items: true }
    });

    if (!result) {
      return res.status(404).json({ error: 'Detection result not found' });
    }

    // If manual tags are provided, update the detection
    if (manualTags) {
      const tags = JSON.parse(manualTags as string);
      
      // Update or create items with manual tags
      await prisma.detectionResult.update({
        where: { id },
        data: {
          items: {
            deleteMany: {},
            create: tags.map((tag: string) => ({
              label: tag,
              confidence: 100, // Manual tags have 100% confidence
              coordinates: {},
              isManualTag: true
            }))
          }
        }
      });

      // Fetch updated result
      result = await prisma.detectionResult.findUnique({
        where: { id },
        include: { items: true }
      });
    }
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching detection result:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detection result'
    });
  }
});

export default router;