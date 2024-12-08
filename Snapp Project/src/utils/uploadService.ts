import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { logger } from './logger';

interface UploadOptions {
  onProgress?: (progress: { loaded: number; total: number }) => void;
}

class UploadService {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async uploadImage(file: Blob, options?: UploadOptions): Promise<string> {
    try {
      const key = `uploads/${Date.now()}-${crypto.randomUUID()}.jpg`;
      
      const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
        Body: file,
        ContentType: 'image/jpeg'
      });

      await this.client.send(command);

      const imageUrl = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
      
      logger.info('upload', 'Image uploaded successfully', {
        bucket: env.AWS_S3_BUCKET,
        key,
        size: file.size
      });

      return imageUrl;
    } catch (error) {
      logger.error('upload', 'Image upload failed', error);
      throw error;
    }
  }
}

export const uploadService = new UploadService();