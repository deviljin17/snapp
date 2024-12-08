import express from 'express';
import { PrismaClient } from '@prisma/client';
import { StoreService } from '../services/storeService';

const router = express.Router();
const prisma = new PrismaClient();
const storeService = new StoreService();

const PAGE_SIZE = 20;

interface ResultsQuery {
  page?: string;
  sort?: 'price_asc' | 'price_desc' | 'confidence_desc';
  category?: string;
  color?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minConfidence?: string;
  stores?: string;
  sustainability?: string;
}

router.get('/:detectionId', async (req, res) => {
  try {
    const { detectionId } = req.params;
    const {
      page = '1',
      sort = 'confidence_desc',
      category,
      color,
      brand,
      minPrice,
      maxPrice,
      minConfidence,
      stores,
      sustainability
    }: ResultsQuery = req.query;

    // Get cached filter options
    const cacheKey = `filters:${detectionId}`;
    let filterOptions = await cache.get(cacheKey);

    if (!filterOptions) {
      // Precompute filter options
      filterOptions = await Promise.all([
        prisma.product.groupBy({
          by: ['category'],
          where: { matches: { some: { detectedItem: { resultId: detectionId } } } }
        }),
        prisma.product.groupBy({
          by: ['brand'],
          where: { matches: { some: { detectedItem: { resultId: detectionId } } } }
        }),
        prisma.product.aggregate({
          _min: { price: true },
          _max: { price: true },
          where: { matches: { some: { detectedItem: { resultId: detectionId } } } }
        })
      ]);

      // Cache filter options
      await cache.set(cacheKey, filterOptions, 3600); // Cache for 1 hour
    }

    // Parse query parameters
    const pageNum = parseInt(page, 10);
    const skip = (pageNum - 1) * PAGE_SIZE;
    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;
    const minConfidenceNum = minConfidence ? parseFloat(minConfidence) : 70;
    const storeList = stores?.split(',');
    const sustainabilityFilters = sustainability?.split(',');

    // Build optimized filter conditions with indexes
    const where = {
      resultId: detectionId,
      confidence: { gte: minConfidenceNum },
      matches: {
        some: {
          product: {
            AND: [
              ...(category ? [{ category }] : []),
              ...(brand ? [{ brand }] : []),
              ...(color ? [{ features: { path: ['color'], equals: color } }] : []),
              ...(minPriceNum ? [{ price: { gte: minPriceNum } }] : []),
              ...(maxPriceNum ? [{ price: { lte: maxPriceNum } }] : []),
              ...(storeList?.length ? [{ store: { in: storeList } }] : []),
              ...(sustainabilityFilters?.length ? [{
                sustainability: {
                  OR: sustainabilityFilters.map(filter => ({
                    [filter]: true
                  }))
                }
              }] : [])
            ]
          }
        }
      }
    };

    // Get total count for pagination
    const totalItems = await prisma.detectedItem.count({ where });
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    // Get items with matches using optimized query
    const items = await prisma.detectedItem.findMany({
      where,
      include: {
        matches: {
          include: {
            product: true
          },
          orderBy: {
            ...(sort === 'price_asc' && { product: { price: 'asc' } }),
            ...(sort === 'price_desc' && { product: { price: 'desc' } }),
            ...(sort === 'confidence_desc' && { similarity: 'desc' })
          }
        }
      },
      skip,
      take: PAGE_SIZE
    });

    // Get store prices and availability
    const itemsWithStores = await Promise.all(
      items.map(async (item) => {
        const matchedProducts = item.matches.map(match => match.product);
        const storeResults = await Promise.all(
          matchedProducts.map(async (product) => {
            const storeInfo = await storeService.findBestPrices(product.name);
            return {
              ...product,
              stores: storeInfo.stores
            };
          })
        );

        return {
          id: item.id,
          label: item.label,
          confidence: item.confidence,
          coordinates: item.coordinates,
          matches: storeResults
        };
      })
    );

    res.json({
      success: true,
      data: {
        items: itemsWithStores,
        filters: {
          categories: filterOptions[0],
          brands: filterOptions[1],
          colors: await prisma.product.groupBy({
            by: ['features'],
            where: { matches: { some: { detectedItem: { resultId: detectionId } } } }
          }).then(results => results.map(r => r.features['color']).filter(Boolean)),
          sustainability: await prisma.sustainabilityInfo.groupBy({
            by: ['ecoFriendly', 'recycledMaterials', 'secondHand', 'organicMaterials'],
            where: {
              product: {
                matches: { some: { detectedItem: { resultId: detectionId } } }
              }
            }
          }),
          priceRange: {
            min: filterOptions[2]._min.price,
            max: filterOptions[2]._max.price
          }
        },
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          hasNextPage: pageNum < totalPages,
          hasPreviousPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Results API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch results'
    });
  }
});

export default router;