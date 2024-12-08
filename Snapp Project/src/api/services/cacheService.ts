import Redis from 'ioredis';
import { StoreProduct } from './stores/types';

export class CacheService {
  private redis: Redis;
  private readonly DEFAULT_TTL = 86400; // 24 hours in seconds

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async getProductDetails(url: string): Promise<StoreProduct | null> {
    return this.get<StoreProduct>(`product:${url}`);
  }

  async setProductDetails(url: string, product: StoreProduct): Promise<void> {
    await this.set(`product:${url}`, product);
  }

  async getSearchResults(query: string): Promise<StoreProduct[] | null> {
    return this.get<StoreProduct[]>(`search:${query}`);
  }

  async setSearchResults(query: string, results: StoreProduct[]): Promise<void> {
    await this.set(`search:${query}`, results);
  }

  async getInfo(): Promise<Record<string, string>> {
    try {
      return await this.redis.info();
    } catch (error) {
      console.error('Redis info error:', error);
      return {};
    }
  }

  async close(): Promise<void> {
    await this.redis.quit();
  }
}