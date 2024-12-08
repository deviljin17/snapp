import sharp from 'sharp';
import { ProcessedImage } from './imageService';
import { LoggerService } from './loggerService';

interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export class ImageProcessor {
  private readonly defaultOptions: ProcessingOptions = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 85,
    format: 'jpeg'
  };

  async processImage(
    file: Express.Multer.File,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      const opts = { ...this.defaultOptions, ...options };
      let pipeline = sharp(file.buffer);

      // Get image metadata
      const metadata = await pipeline.metadata();
      
      // Auto-crop to focus on the main subject
      const { region } = await this.detectContentRegion(pipeline);
      if (region) {
        pipeline = pipeline.extract(region);
      }

      // Remove background if possible
      pipeline = await this.removeBackground(pipeline);

      // Resize while maintaining aspect ratio
      pipeline = pipeline.resize(opts.maxWidth, opts.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Enhance image quality
      pipeline = pipeline.normalize()
        .modulate({
          brightness: 1.05,
          saturation: 1.1
        })
        .sharpen({
          sigma: 0.5,
          m1: 0.1,
          m2: 0.3
        });

      // Convert to desired format with compression
      const buffer = await pipeline
        .toFormat(opts.format!, { quality: opts.quality })
        .toBuffer();

      return {
        buffer,
        mimetype: `image/${opts.format}`,
        originalname: file.originalname
      };
    } catch (error) {
      LoggerService.logAPIError('imageProcessor', error as Error);
      throw new Error('Failed to process image');
    }
  }

  private async detectContentRegion(pipeline: sharp.Sharp) {
    try {
      // Use sharp's built-in trim to detect content edges
      const { info: trimInfo } = await pipeline
        .trim({ threshold: 10 })
        .toBuffer({ resolveWithObject: true });

      // Add padding around the detected region
      const padding = 50;
      return {
        region: {
          left: Math.max(0, trimInfo.trimOffsetLeft! - padding),
          top: Math.max(0, trimInfo.trimOffsetTop! - padding),
          width: trimInfo.width! + padding * 2,
          height: trimInfo.height! + padding * 2
        }
      };
    } catch (error) {
      // If trim fails, return null to skip cropping
      return { region: null };
    }
  }

  private async removeBackground(pipeline: sharp.Sharp): Promise<sharp.Sharp> {
    try {
      // Create a mask for the main subject
      const { data, info } = await pipeline
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Simple background removal using alpha thresholding
      const mask = Buffer.alloc(info.width * info.height);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Calculate pixel intensity
        const intensity = (r + g + b) / 3;
        
        // Set mask based on intensity and alpha
        mask[i / 4] = intensity > 240 && a > 200 ? 0 : 255;
      }

      // Apply the mask
      return pipeline.composite([{
        input: mask,
        raw: {
          width: info.width,
          height: info.height,
          channels: 1
        },
        blend: 'dest-in'
      }]);
    } catch (error) {
      // If background removal fails, return original pipeline
      return pipeline;
    }
  }
}