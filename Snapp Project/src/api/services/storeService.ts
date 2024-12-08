import { AmazonStore } from './stores/amazonStore';
import { StoreScraper } from './stores/scraper';
import { StoreProduct, StoreError } from './stores/types';
import { CacheService } from './cacheService';

export class StoreService {
  private cache: CacheService;
  private stores: AmazonStore;
  private scraper: StoreScraper;

  constructor() {
    this.cache = new CacheService();
    this.stores = new AmazonStore();
    this.scraper = new StoreScraper();
  }

  private async getShippingInfo(store: string, price: number): Promise<{ cost: number; time: string }> {
    // Simulated shipping rules
    switch (store.toLowerCase()) {
      case 'amazon':
        return {
          cost: price >= 25 ? 0 : 5.99,
          time: 'Free 2-day shipping'
        };
      default:
        return {
          cost: price >= 50 ? 0 : 7.99,
          time: '3-5 business days'
        };
    }
  }

  async getProductDetails(url: string): Promise<StoreProduct> {
    const cached = await this.cache.getProductDetails(url);
    if (cached) return cached;

    try {
      let product: StoreProduct;

      if (url.includes('amazon.com')) {
        product = await this.stores.fetchProduct(url);
      } else {
        product = await this.scraper.scrapeProduct(url);
      }

      await this.cache.setProductDetails(url, product);
      return product;
    } catch (error) {
      if (error instanceof StoreError) {
        // Try fallback to scraping for API errors
        const product = await this.scraper.scrapeProduct(url);
        await this.cache.setProductDetails(url, product);
        return product;
      }
      throw error;
    }
  }

  async findBestPrices(productName: string): Promise<{
    item: string;
    stores: Array<{
      store_name: string;
      price: number;
      total_price: number;
      url: string;
      shipping: {
        cost: number;
        time: string;
      };
      badge?: string;
      inStock: boolean;
    }>;
  }> {
    const cached = await this.cache.getSearchResults(productName);
    let products = cached || [];

    if (!cached) {
      try {
        // Search across multiple stores
        const results = await Promise.all([
          this.stores.searchProduct(productName)
        ]);
        products = results.flat();
        await this.cache.setSearchResults(productName, products);
      } catch (error) {
        console.error('Search error:', error);
        products = [];
      }
    }

    // Get shipping info and calculate total prices
    const storesWithShipping = await Promise.all(
      products.map(async (product) => {
        const shipping = await this.getShippingInfo(product.store, product.price);
        return {
          store_name: product.store,
          price: product.price,
          total_price: product.price + shipping.cost,
          url: product.url,
          shipping,
          inStock: product.inStock
        };
      })
    );

    // Sort by total price and add badges
    const sortedStores = storesWithShipping.sort((a, b) => a.total_price - b.total_price);
    
    if (sortedStores.length > 0) {
      // Add "Best Price" badge to cheapest in-stock item
      const bestPrice = sortedStores.find(store => store.inStock);
      if (bestPrice) {
        bestPrice.badge = 'Best Price';
      }

      // Add "Free Shipping" badge where applicable
      sortedStores.forEach(store => {
        if (store.shipping.cost === 0 && store !== bestPrice) {
          store.badge = 'Free Shipping';
        }
      });
    }

    return {
      item: productName,
      stores: sortedStores
    };
  }

  async close() {
    await this.scraper.close();
  }
}