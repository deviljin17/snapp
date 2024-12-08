import { PrismaClient, AlertType, NotificationType } from '@prisma/client';
import { StoreService } from './storeService';
import { LoggerService } from './loggerService';
import { CacheService } from './cacheService';

const prisma = new PrismaClient();
const storeService = new StoreService();
const cache = new CacheService();

export class NotificationService {
  async checkWishlistAlerts() {
    try {
      // Get all active alerts
      const alerts = await prisma.wishlistAlert.findMany({
        where: { active: true },
        include: {
          favorite: {
            include: {
              product: true
            }
          }
        }
      });

      for (const alert of alerts) {
        const { favorite } = alert;
        const currentPrice = await this.getCurrentPrice(favorite.product);

        if (!currentPrice) continue;

        switch (alert.type) {
          case AlertType.PRICE_DROP:
            if (alert.targetPrice && currentPrice <= alert.targetPrice) {
              await this.createNotification({
                userId: favorite.userId,
                alertId: alert.id,
                type: NotificationType.PRICE_DECREASE,
                message: `Price drop alert: ${favorite.product.name} is now $${currentPrice} (Target: $${alert.targetPrice})`
              });
            }
            break;

          case AlertType.BACK_IN_STOCK:
            const isInStock = await this.checkStock(favorite.product);
            if (isInStock) {
              await this.createNotification({
                userId: favorite.userId,
                alertId: alert.id,
                type: NotificationType.BACK_IN_STOCK,
                message: `${favorite.product.name} is back in stock!`
              });
            }
            break;

          case AlertType.ANY_CHANGE:
            const lastPrice = await this.getLastKnownPrice(favorite.product);
            if (lastPrice && currentPrice !== lastPrice) {
              const type = currentPrice < lastPrice 
                ? NotificationType.PRICE_DECREASE 
                : NotificationType.PRICE_INCREASE;
              
              await this.createNotification({
                userId: favorite.userId,
                alertId: alert.id,
                type,
                message: `Price changed for ${favorite.product.name}: $${lastPrice} → $${currentPrice}`
              });
            }
            break;
        }

        // Update last known price
        await this.updateLastKnownPrice(favorite.product.id, currentPrice);
      }
    } catch (error) {
      LoggerService.logAPIError('checkWishlistAlerts', error as Error);
    }
  }

  private async getCurrentPrice(product: any): Promise<number | null> {
    try {
      const storeInfo = await storeService.findBestPrices(product.name);
      return storeInfo.stores[0]?.price || null;
    } catch (error) {
      LoggerService.logStoreError('getCurrentPrice', product.url, error as Error);
      return null;
    }
  }

  private async checkStock(product: any): Promise<boolean> {
    try {
      const storeInfo = await storeService.findBestPrices(product.name);
      return storeInfo.stores.some(store => store.inStock);
    } catch (error) {
      LoggerService.logStoreError('checkStock', product.url, error as Error);
      return false;
    }
  }

  private async getLastKnownPrice(product: any): Promise<number | null> {
    const cacheKey = `lastPrice:${product.id}`;
    return cache.get<number>(cacheKey);
  }

  private async updateLastKnownPrice(productId: string, price: number): Promise<void> {
    const cacheKey = `lastPrice:${productId}`;
    await cache.set(cacheKey, price, 86400); // 24 hours TTL
  }

  private async createNotification(data: {
    userId: string;
    alertId: string;
    type: NotificationType;
    message: string;
  }) {
    try {
      await prisma.notification.create({
        data: {
          userId: data.userId,
          alertId: data.alertId,
          type: data.type,
          message: data.message
        }
      });
    } catch (error) {
      LoggerService.logAPIError('createNotification', error as Error);
    }
  }

  async getUserNotifications(userId: string, options: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      const { unreadOnly = false, limit = 20, offset = 0 } = options;

      return await prisma.notification.findMany({
        where: {
          userId,
          ...(unreadOnly && { read: false })
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      });
    } catch (error) {
      LoggerService.logAPIError('getUserNotifications', error as Error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          read: true,
          readAt: new Date()
        }
      });
    } catch (error) {
      LoggerService.logAPIError('markNotificationAsRead', error as Error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();