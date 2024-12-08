import { 
  RekognitionClient, 
  DetectLabelsCommand,
  DetectLabelsCommandInput,
  Label
} from '@aws-sdk/client-rekognition';
import { PrismaClient } from '@prisma/client';
import { ProcessedImage } from './imageService';
import { BrandDetectionService } from './brandDetectionService';

const prisma = new PrismaClient();
const brandDetection = new BrandDetectionService();

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const CLOTHING_CATEGORIES = [
  'Dress', 'Shirt', 'Pants', 'Shoes', 'Jacket',
  'Coat', 'Suit', 'Accessories', 'Hat', 'Tie',
  'Belt', 'Sunglasses', 'Handbag', 'Footwear'
];

const CONFIDENCE_THRESHOLD = 80;
const QUALITY_ISSUES = {
  LIGHTING: 'lighting',
  BLUR: 'blur',
  VISIBILITY: 'visibility',
  ANGLE: 'angle'
};

interface DetectedClothing {
  label: string;
  confidence: number;
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

interface DetectionResult {
  success: boolean;
  items?: DetectedClothing[];
  qualityIssues?: string[];
  suggestions?: string[];
  detectionId?: string;
}

export async function detectClothing(image: ProcessedImage): Promise<DetectionResult> {
  try {
    // Prepare image for Rekognition
    const params: DetectLabelsCommandInput = {
      Image: {
        S3Object: {
          Bucket: process.env.AWS_S3_BUCKET,
          Name: image.key
        }
      },
      MinConfidence: CONFIDENCE_THRESHOLD,
      MaxLabels: 20
    };

    // Detect labels using Rekognition
    const command = new DetectLabelsCommand(params);
    const response = await rekognition.send(command);

    // Try to detect brand automatically
    const brandResult = await brandDetection.detectBrand(image);
    const brandInfo = brandResult || {
      brand: image.manualBrand,
      confidence: 100 // Manual input has 100% confidence
    };

    // Filter and process clothing items
    const clothingItems = response.Labels?.filter(label => 
      CLOTHING_CATEGORIES.some(category => 
        label.Name?.toLowerCase().includes(category.toLowerCase())
      )
    ).map(label => processLabel(label)) || [];

    // Check if detection was successful
    if (clothingItems.length === 0 || 
        clothingItems.every(item => item.confidence < CONFIDENCE_THRESHOLD)) {
      // Analyze image quality issues
      const qualityIssues = await analyzeImageQuality(image);
      
      return {
        success: false,
        qualityIssues: qualityIssues,
        suggestions: generateSuggestions(qualityIssues)
      };
    }

    // Save results to database
    const result = await prisma.detectionResult.create({
      data: {
        imageUrl: image.url,
        items: {
          create: clothingItems?.map(item => ({
            label: item.label,
            brand: brandInfo?.brand,
            brandConfidence: brandInfo?.confidence,
            confidence: item.confidence,
            coordinates: item.boundingBox,
            brandCoordinates: brandInfo?.boundingBox,
            isManualBrand: !brandResult && !!image.manualBrand
          }))
        }
      },
      include: {
        items: true
      }
    });

    return {
      success: true,
      items: clothingItems,
      detectionId: result.id
    };
  } catch (error) {
    LoggerService.logAPIError('Vision API error:', error);
    throw error;
  }
}

function processLabel(label: Label): DetectedClothing {
  const instance = label.Instances?.[0];
  const box = instance?.BoundingBox;

  return {
    label: label.Name || 'Unknown',
    confidence: label.Confidence || 0,
    boundingBox: {
      left: box?.Left || 0,
      top: box?.Top || 0,
      width: box?.Width || 0,
      height: box?.Height || 0
    }
  };
}

async function analyzeImageQuality(image: ProcessedImage): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    // Analyze brightness
    const brightness = await calculateBrightness(image.buffer);
    if (brightness < 0.3 || brightness > 0.9) {
      issues.push(QUALITY_ISSUES.LIGHTING);
    }

    // Analyze blur
    const blurScore = await calculateBlurScore(image.buffer);
    if (blurScore < 0.5) {
      issues.push(QUALITY_ISSUES.BLUR);
    }

    // Check if main subject is visible
    const visibilityScore = await calculateVisibilityScore(image.buffer);
    if (visibilityScore < 0.7) {
      issues.push(QUALITY_ISSUES.VISIBILITY);
    }

    // Check image angle
    const angleScore = await calculateAngleScore(image.buffer);
    if (angleScore < 0.6) {
      issues.push(QUALITY_ISSUES.ANGLE);
    }

    return issues;
  } catch (error) {
    LoggerService.logAPIError('analyzeImageQuality', error as Error);
    return [];
  }
}

function generateSuggestions(issues: string[]): string[] {
  const suggestions: string[] = [];
  
  if (issues.includes(QUALITY_ISSUES.LIGHTING)) {
    suggestions.push('Try taking the photo in better lighting conditions');
  }
  
  if (issues.includes(QUALITY_ISSUES.BLUR)) {
    suggestions.push('Hold your device steady to avoid blur');
  }
  
  if (issues.includes(QUALITY_ISSUES.VISIBILITY)) {
    suggestions.push('Ensure the entire outfit is clearly visible in the frame');
  }
  
  if (issues.includes(QUALITY_ISSUES.ANGLE)) {
    suggestions.push('Take the photo straight-on for better results');
  }
  
  return suggestions;
}