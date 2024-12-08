import { RekognitionClient, DetectLabelsCommand, DetectTextCommand } from '@aws-sdk/client-rekognition';
import { env } from '../config/env';
import { logger } from '../utils/logger';

interface DetectedItem {
  label: string;
  confidence: number;
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  brand?: {
    name: string;
    confidence: number;
  };
}

class VisionService {
  private client: RekognitionClient;
  private readonly CONFIDENCE_THRESHOLD = 80;

  constructor() {
    this.client = new RekognitionClient({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async analyzeImage(imageUrl: string) {
    try {
      const imageBuffer = await this.fetchImageBuffer(imageUrl);
      
      const [labelResults, textResults] = await Promise.all([
        this.detectLabels(imageBuffer),
        this.detectText(imageBuffer)
      ]);

      const items = this.processResults(labelResults, textResults);

      logger.info('vision', 'Image analysis complete', {
        itemsCount: items.length
      });

      return {
        items,
        detectionId: crypto.randomUUID()
      };
    } catch (error) {
      logger.error('vision', 'Image analysis failed', error);
      throw error;
    }
  }

  private async fetchImageBuffer(imageUrl: string): Promise<Buffer> {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private async detectLabels(imageBuffer: Buffer) {
    const command = new DetectLabelsCommand({
      Image: { Bytes: imageBuffer },
      MinConfidence: this.CONFIDENCE_THRESHOLD,
      MaxLabels: 20
    });

    return this.client.send(command);
  }

  private async detectText(imageBuffer: Buffer) {
    const command = new DetectTextCommand({
      Image: { Bytes: imageBuffer }
    });

    return this.client.send(command);
  }

  private processResults(labelResults: any, textResults: any): DetectedItem[] {
    const items: DetectedItem[] = [];

    // Process clothing labels
    labelResults.Labels?.forEach((label: any) => {
      if (this.isClothingItem(label.Name) && label.Confidence >= this.CONFIDENCE_THRESHOLD) {
        items.push({
          label: label.Name,
          confidence: label.Confidence,
          boundingBox: this.getBoundingBox(label.Instances?.[0]?.BoundingBox)
        });
      }
    });

    // Process brand text
    textResults.TextDetections?.forEach((text: any) => {
      if (this.isBrandName(text.DetectedText) && text.Confidence >= this.CONFIDENCE_THRESHOLD) {
        const existingItem = items.find(item => 
          this.boxesOverlap(item.boundingBox, this.getBoundingBox(text.Geometry?.BoundingBox))
        );

        if (existingItem) {
          existingItem.brand = {
            name: text.DetectedText,
            confidence: text.Confidence
          };
        }
      }
    });

    return items;
  }

  private isClothingItem(label: string): boolean {
    const clothingCategories = [
      'Dress', 'Shirt', 'Pants', 'Shoes', 'Jacket',
      'Coat', 'Suit', 'Accessories', 'Hat', 'Tie',
      'Belt', 'Sunglasses', 'Handbag', 'Footwear'
    ];
    return clothingCategories.some(category => 
      label.toLowerCase().includes(category.toLowerCase())
    );
  }

  private isBrandName(text: string): boolean {
    const commonBrands = [
      'Nike', 'Adidas', 'Gucci', 'Zara', 'H&M',
      'Uniqlo', 'Prada', 'Louis Vuitton', 'Calvin Klein',
      'Ralph Lauren', 'Tommy Hilfiger', 'Under Armour'
    ];
    return commonBrands.some(brand => 
      text.toLowerCase().includes(brand.toLowerCase())
    );
  }

  private getBoundingBox(box: any) {
    return {
      left: box?.Left || 0,
      top: box?.Top || 0,
      width: box?.Width || 0,
      height: box?.Height || 0
    };
  }

  private boxesOverlap(box1: any, box2: any): boolean {
    return !(
      box1.left + box1.width < box2.left ||
      box2.left + box2.width < box1.left ||
      box1.top + box1.height < box2.top ||
      box2.top + box2.height < box1.top
    );
  }
}

export const visionService = new VisionService();