import { RekognitionClient, DetectLabelsCommand, DetectTextCommand } from '@aws-sdk/client-rekognition';
import { LoggerService } from './loggerService';
import { ProcessedImage } from './imageService';

interface BrandDetectionResult {
  brand: string;
  confidence: number;
  boundingBox?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export class BrandDetectionService {
  private rekognition: RekognitionClient;
  private readonly CONFIDENCE_THRESHOLD = 70;
  private readonly COMMON_BRANDS = new Set([
    'Nike', 'Adidas', 'Gucci', 'Zara', 'H&M',
    'Uniqlo', 'Prada', 'Louis Vuitton', 'Calvin Klein',
    'Ralph Lauren', 'Tommy Hilfiger', 'Under Armour'
  ]);

  constructor() {
    this.rekognition = new RekognitionClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
  }

  async detectBrand(image: ProcessedImage): Promise<BrandDetectionResult | null> {
    try {
      const [logoResult, textResult] = await Promise.all([
        this.detectLogos(image),
        this.detectText(image)
      ]);

      // Combine and analyze results
      const brandResults = [
        ...(logoResult || []),
        ...(textResult || [])
      ].filter(result => 
        this.COMMON_BRANDS.has(result.brand) &&
        result.confidence >= this.CONFIDENCE_THRESHOLD
      );

      // Return the result with highest confidence
      return brandResults.length > 0
        ? brandResults.reduce((prev, current) => 
            current.confidence > prev.confidence ? current : prev
          )
        : null;
    } catch (error) {
      LoggerService.logAPIError('brandDetection', error as Error);
      return null;
    }
  }

  private async detectLogos(image: ProcessedImage): Promise<BrandDetectionResult[]> {
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: image.buffer
      },
      MaxLabels: 10,
      MinConfidence: this.CONFIDENCE_THRESHOLD
    });

    const response = await this.rekognition.send(command);
    
    return response.Labels?.filter(label => 
      label.Name && this.COMMON_BRANDS.has(label.Name)
    ).map(label => ({
      brand: label.Name!,
      confidence: label.Confidence || 0,
      boundingBox: label.Instances?.[0]?.BoundingBox && {
        left: label.Instances[0].BoundingBox.Left || 0,
        top: label.Instances[0].BoundingBox.Top || 0,
        width: label.Instances[0].BoundingBox.Width || 0,
        height: label.Instances[0].BoundingBox.Height || 0
      }
    })) || [];
  }

  private async detectText(image: ProcessedImage): Promise<BrandDetectionResult[]> {
    const command = new DetectTextCommand({
      Image: {
        Bytes: image.buffer
      }
    });

    const response = await this.rekognition.send(command);
    
    return response.TextDetections?.filter(text =>
      text.DetectedText && this.COMMON_BRANDS.has(text.DetectedText)
    ).map(text => ({
      brand: text.DetectedText!,
      confidence: text.Confidence || 0,
      boundingBox: text.Geometry?.BoundingBox && {
        left: text.Geometry.BoundingBox.Left || 0,
        top: text.Geometry.BoundingBox.Top || 0,
        width: text.Geometry.BoundingBox.Width || 0,
        height: text.Geometry.BoundingBox.Height || 0
      }
    })) || [];
  }
}