import { PrismaClient } from '@prisma/client';
import { LoggerService } from './loggerService';
import { detectClothing } from './visionService';
import { ProcessedImage } from './imageService';

const prisma = new PrismaClient();

interface DetectionTest {
  imageUrl: string;
  actualLabels: string[];
  detectedLabels: Array<{
    label: string;
    confidence: number;
  }>;
  success: boolean;
  qualityIssues?: string[];
}

export class DetectionTestService {
  private readonly CONFIDENCE_THRESHOLDS = [70, 80, 90];
  private readonly QUALITY_WEIGHTS = {
    lighting: 0.3,
    blur: 0.3,
    visibility: 0.2,
    angle: 0.2
  };

  async runDetectionTests(images: ProcessedImage[]): Promise<{
    optimalThreshold: number;
    accuracyByThreshold: Record<number, number>;
    qualityIssues: Record<string, number>;
  }> {
    try {
      const results: DetectionTest[] = [];

      // Test each image at different confidence thresholds
      for (const image of images) {
        const testResult = await this.testImage(image);
        if (testResult) {
          results.push(testResult);
        }
      }

      // Calculate accuracy for each threshold
      const accuracyByThreshold: Record<number, number> = {};
      for (const threshold of this.CONFIDENCE_THRESHOLDS) {
        accuracyByThreshold[threshold] = this.calculateAccuracy(results, threshold);
      }

      // Find optimal threshold
      const optimalThreshold = this.findOptimalThreshold(accuracyByThreshold);

      // Analyze quality issues
      const qualityIssues = this.analyzeQualityIssues(results);

      // Log results
      await this.logTestResults({
        totalTests: results.length,
        accuracyByThreshold,
        optimalThreshold,
        qualityIssues
      });

      return {
        optimalThreshold,
        accuracyByThreshold,
        qualityIssues
      };
    } catch (error) {
      LoggerService.logAPIError('detectionTest', error as Error);
      throw error;
    }
  }

  private async testImage(image: ProcessedImage): Promise<DetectionTest | null> {
    try {
      const result = await detectClothing(image);

      if (!result.success) {
        return {
          imageUrl: image.url,
          actualLabels: [],
          detectedLabels: [],
          success: false,
          qualityIssues: result.qualityIssues
        };
      }

      return {
        imageUrl: image.url,
        actualLabels: [], // Would be populated from ground truth data
        detectedLabels: result.items?.map(item => ({
          label: item.label,
          confidence: item.confidence
        })) || [],
        success: true
      };
    } catch (error) {
      LoggerService.logAPIError('testImage', error as Error);
      return null;
    }
  }

  private calculateAccuracy(results: DetectionTest[], threshold: number): number {
    const validResults = results.filter(r => r.success);
    if (validResults.length === 0) return 0;

    const accurateDetections = validResults.filter(result => {
      const highConfidenceDetections = result.detectedLabels.filter(
        detection => detection.confidence >= threshold
      );

      // Consider detection accurate if at least one high-confidence label matches
      return highConfidenceDetections.some(detection =>
        result.actualLabels.includes(detection.label)
      );
    });

    return (accurateDetections.length / validResults.length) * 100;
  }

  private findOptimalThreshold(accuracyByThreshold: Record<number, number>): number {
    let optimalThreshold = this.CONFIDENCE_THRESHOLDS[0];
    let bestAccuracy = accuracyByThreshold[optimalThreshold];

    for (const threshold of this.CONFIDENCE_THRESHOLDS) {
      const accuracy = accuracyByThreshold[threshold];
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        optimalThreshold = threshold;
      }
    }

    return optimalThreshold;
  }

  private analyzeQualityIssues(results: DetectionTest[]): Record<string, number> {
    const issues: Record<string, number> = {};
    let totalIssues = 0;

    results.forEach(result => {
      if (result.qualityIssues) {
        result.qualityIssues.forEach(issue => {
          issues[issue] = (issues[issue] || 0) + 1;
          totalIssues++;
        });
      }
    });

    // Convert to percentages
    if (totalIssues > 0) {
      Object.keys(issues).forEach(issue => {
        issues[issue] = (issues[issue] / totalIssues) * 100;
      });
    }

    return issues;
  }

  private async logTestResults(data: {
    totalTests: number;
    accuracyByThreshold: Record<number, number>;
    optimalThreshold: number;
    qualityIssues: Record<string, number>;
  }) {
    try {
      await prisma.detectionTestLog.create({
        data: {
          totalTests: data.totalTests,
          accuracyByThreshold: data.accuracyByThreshold,
          optimalThreshold: data.optimalThreshold,
          qualityIssues: data.qualityIssues,
          timestamp: new Date()
        }
      });
    } catch (error) {
      LoggerService.logAPIError('logTestResults', error as Error);
    }
  }

  async getSuggestedImprovements(qualityIssues: Record<string, number>): Promise<string[]> {
    const suggestions: string[] = [];
    const ISSUE_THRESHOLDS = {
      lighting: 20,
      blur: 15,
      visibility: 25,
      angle: 20
    };

    Object.entries(qualityIssues).forEach(([issue, percentage]) => {
      const threshold = ISSUE_THRESHOLDS[issue as keyof typeof ISSUE_THRESHOLDS];
      if (percentage > threshold) {
        suggestions.push(this.getImprovementSuggestion(issue));
      }
    });

    return suggestions;
  }

  private getImprovementSuggestion(issue: string): string {
    const suggestions = {
      lighting: "Try taking photos in better lighting conditions or use additional lighting",
      blur: "Hold your device steady and ensure the subject is in focus",
      visibility: "Make sure the entire item is clearly visible in the frame",
      angle: "Take photos straight-on for best results"
    };

    return suggestions[issue as keyof typeof suggestions] || 
      "Try improving image quality for better results";
  }
}

export const detectionTestService = new DetectionTestService();