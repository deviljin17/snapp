import express from 'express';
import { upload } from '../middleware/upload';
import { analyzeImage } from '../services/imageService';
import { ImageProcessor } from './imageProcessor';
import { LoggerService } from './loggerService';

const router = express.Router();
const imageProcessor = new ImageProcessor();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Enhanced image processing pipeline
    const processed = await imageProcessor.processImage(req.file, {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 85,
      format: 'jpeg'
    });

    // Analyze the processed image
    const analysis = await analyzeImage(processed.buffer);
    
    // Log successful upload
    await LoggerService.logUpload(
      req.user?.id || 'anonymous',
      'processed-image-url',
      true
    );

    res.json({
      success: true,
      data: {
        analysis,
        imageUrl: URL.createObjectURL(new Blob([processed.buffer]))
      }
    });
  } catch (error) {
    // Log error and return user-friendly message
    await LoggerService.logUpload(
      req.user?.id || 'anonymous',
      '',
      false,
      error instanceof Error ? error.message : 'Upload failed'
    );

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    });
  }
});

export default router;