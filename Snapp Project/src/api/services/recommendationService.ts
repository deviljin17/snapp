import { PrismaClient } from '@prisma/client';
import { findSimilarProducts } from './similaritySearch';
import { LoggerService } from './loggerService';
import { CacheService } from './cacheService';

const prisma = new PrismaClient();
const cache = new CacheService();

interface UserSimilarity {
  userId: string;
  score: number;
}

export class RecommendationService {
  private readonly SIMILARITY_THRESHOLD = 0.3;
  private readonly CACHE_TTL = 3600; // 1 hour

  async getPersonalizedResults(
    userId: string,
    features: Float32Array,
    category: string,
    matchCriteria?: MatchCriteria
  ) {
    try {
      const [preferences, similarUsers] = await Promise.all([
        prisma.userPreference.findUnique({
        where: { userId }
        }),
        this.findSimilarUsers(userId)
      ]);

      // Get similar products
      let products = await findSimilarProducts(features, category, {
        ...matchCriteria,
        // Include user's preferred brands if no specific brand is requested
        brand: matchCriteria?.brand || 
          (preferences?.brands.length ? preferences.brands[0] : undefined)
      }, 50);

      // Get collaborative recommendations
      const collaborativeProducts = await this.getCollaborativeRecommendations(
        userId,
        similarUsers,
        category
      );

      // Merge visual and collaborative results
      products = this.mergeRecommendations(products, collaborativeProducts);

      if (preferences) {
        // Apply user preferences as filters
        products = products.filter(product => {
          // Check price range
          if (preferences.minPrice && product.metadata.price < preferences.minPrice) {
            return false;
          }
          if (preferences.maxPrice && product.metadata.price > preferences.maxPrice) {
            return false;
          }

          // Only apply brand filter if no specific brand was requested
          if (!matchCriteria?.brand && preferences.brands.length > 0 && 
              !preferences.brands.includes(product.metadata.brand)) {
            return false;
          }

          // Check preferred stores
          if (preferences.stores.length > 0 &&
              !product.metadata.stores.some(store => 
                preferences.stores.includes(store.name)
              )) {
            return false;
          }

          return true;
        });

        // Boost scores for preferred attributes
        products = products.map(product => {
          let boostScore = product.similarity;

          // Only boost brand if no specific brand was requested
          if (!matchCriteria?.brand && 
              preferences.brands.includes(product.metadata.brand)) {
            boostScore *= 1.2;
          }

          // Boost for preferred colors
          if (preferences.colors.includes(product.metadata.color)) {
            boostScore *= 1.1;
          }

          // Boost for preferred stores
          if (product.metadata.stores.some(store => 
              preferences.stores.includes(store.name))) {
            boostScore *= 1.15;
          }

          return {
            ...product,
            similarity: boostScore
          };
        });

        // Re-sort by boosted scores
        products.sort((a, b) => {
          // Keep exact matches at the top
          if (a.exactMatch && !b.exactMatch) return -1;
          if (!a.exactMatch && b.exactMatch) return 1;
          return b.similarity - a.similarity;
        });
      }

      // Take top results
      return products.slice(0, 20);
    } catch (error) {
      LoggerService.logAPIError('recommendationService', error as Error);
      throw error;
    }
  }

  private async findSimilarUsers(userId: string): Promise<UserSimilarity[]> {
    const cacheKey = `similar_users:${userId}`;
    const cached = await cache.get<UserSimilarity[]>(cacheKey);
    if (cached) return cached;

    try {
      // Get target user's behavior
      const targetUser = await this.getUserBehavior(userId);
      if (!targetUser) return [];

      // Get all other users' behavior
      const allUsers = await prisma.user.findMany({
        where: { id: { not: userId } },
        select: { id: true }
      });

      // Calculate similarity scores
      const similarities = await Promise.all(
        allUsers.map(async (user) => {
          const behavior = await this.getUserBehavior(user.id);
          if (!behavior) return null;

          const score = this.calculateSimilarity(targetUser, behavior);
          return {
            userId: user.id,
            score
          };
        })
      );

      // Filter and sort by similarity score
      const validSimilarities = similarities
        .filter((s): s is UserSimilarity => 
          s !== null && s.score >= this.SIMILARITY_THRESHOLD
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      await cache.set(cacheKey, validSimilarities, this.CACHE_TTL);
      return validSimilarities;
    } catch (error) {
      LoggerService.logAPIError('findSimilarUsers', error as Error);
      return [];
    }
  }

  private async getUserBehavior(userId: string) {
    try {
      const [favorites, views, searches] = await Promise.all([
        prisma.userFavorite.findMany({
          where: { userId },
          select: { productId: true }
        }),
        prisma.productView.findMany({
          where: { userId },
          select: { productId: true }
        }),
        prisma.searchLog.findMany({
          where: { userId },
          select: { category: true }
        })
      ]);

      return {
        favorites: new Set(favorites.map(f => f.productId)),
        views: new Set(views.map(v => v.productId)),
        categories: new Set(searches.map(s => s.category).filter(Boolean))
      };
    } catch (error) {
      LoggerService.logAPIError('getUserBehavior', error as Error);
      return null;
    }
  }

  private calculateSimilarity(user1: any, user2: any): number {
    const favoriteJaccard = this.jaccardSimilarity(user1.favorites, user2.favorites);
    const viewJaccard = this.jaccardSimilarity(user1.views, user2.views);
    const categoryJaccard = this.jaccardSimilarity(user1.categories, user2.categories);

    return (favoriteJaccard * 0.5) + (viewJaccard * 0.3) + (categoryJaccard * 0.2);
  }

  private jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  private async getCollaborativeRecommendations(
    userId: string,
    similarUsers: UserSimilarity[],
    category?: string
  ) {
    try {
      // Get products liked by similar users
      const similarUserIds = similarUsers.map(u => u.userId);
      const recommendations = await prisma.userFavorite.findMany({
        where: {
          userId: { in: similarUserIds },
          product: category ? { category } : undefined
        },
        include: {
          product: true
        }
      });

      // Weight recommendations by user similarity
      return recommendations.map(rec => {
        const userSimilarity = similarUsers.find(u => u.userId === rec.userId)!;
        return {
          id: rec.product.id,
          similarity: userSimilarity.score,
          metadata: {
            name: rec.product.name,
            brand: rec.product.brand,
            price: rec.product.price,
            imageUrl: rec.product.imageUrl
          }
        };
      });
    } catch (error) {
      LoggerService.logAPIError('getCollaborativeRecommendations', error as Error);
      return [];
    }
  }

  private mergeRecommendations(visualRecs: any[], collaborativeRecs: any[]) {
    // Combine and deduplicate recommendations
    const merged = [...visualRecs];
    const existingIds = new Set(visualRecs.map(r => r.id));

    for (const rec of collaborativeRecs) {
      if (!existingIds.has(rec.id)) {
        merged.push(rec);
        existingIds.add(rec.id);
      }
    }

    // Sort by combined score
    return merged.sort((a, b) => b.similarity - a.similarity);
  }

  async updateUserPreferences(userId: string, detectionId: string) {
    try {
      // Get detection results
      const detection = await prisma.detectionResult.findUnique({
        where: { id: detectionId },
        include: {
          items: {
            include: {
              matches: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      });

      if (!detection) return;

      // Extract preferences from matched items
      const brands = new Set<string>();
      const categories = new Set<string>();
      const colors = new Set<string>();
      const stores = new Set<string>();

      detection.items.forEach(item => {
        item.matches.forEach(match => {
          if (match.product.brand) brands.add(match.product.brand);
          if (match.product.category) categories.add(match.product.category);
          if (match.product.color) colors.add(match.product.color);
          match.product.stores.forEach(store => stores.add(store.name));
        });
      });

      // Update user preferences
      await prisma.userPreference.update({
        where: { userId },
        data: {
          brands: Array.from(brands),
          categories: Array.from(categories),
          colors: Array.from(colors),
          stores: Array.from(stores)
        }
      });
    } catch (error) {
      LoggerService.logAPIError('updateUserPreferences', error as Error);
    }
  }
}

export const recommendationService = new RecommendationService();