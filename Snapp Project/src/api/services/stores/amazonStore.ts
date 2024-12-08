import axios from 'axios';
import { StoreProduct, StoreProvider, StoreError } from './types';

export class AmazonStore implements StoreProvider {
  name = 'Amazon';
  private apiKey = process.env.AMAZON_API_KEY;
  private apiSecret = process.env.AMAZON_API_SECRET;
  private partnerId = process.env.AMAZON_PARTNER_ID;

  async fetchProduct(url: string): Promise<StoreProduct> {
    try {
      const asin = this.extractAsin(url);
      const response = await axios.get(
        `https://webservices.amazon.com/paapi5/getitems`,
        {
          params: {
            'ItemIds': asin,
            'PartnerTag': this.partnerId,
            'Operation': 'GetItems',
            'Resources': [
              'ItemInfo.Title',
              'Offers.Listings.Price',
              'Offers.Listings.Availability'
            ]
          },
          headers: {
            'Authorization': this.generateAuthHeader()
          }
        }
      );

      const item = response.data.ItemsResult.Items[0];
      
      return {
        id: item.ASIN,
        name: item.ItemInfo.Title.DisplayValue,
        price: item.Offers.Listings[0].Price.Amount,
        currency: item.Offers.Listings[0].Price.Currency,
        url: item.DetailPageURL,
        store: this.name,
        inStock: item.Offers.Listings[0].Availability.Type === 'Now'
      };
    } catch (error) {
      throw new StoreError(
        'Failed to fetch Amazon product',
        this.name,
        'API_ERROR'
      );
    }
  }

  async searchProduct(query: string): Promise<StoreProduct[]> {
    try {
      const response = await axios.get(
        `https://webservices.amazon.com/paapi5/searchitems`,
        {
          params: {
            'Keywords': query,
            'SearchIndex': 'Fashion',
            'PartnerTag': this.partnerId,
            'Operation': 'SearchItems'
          },
          headers: {
            'Authorization': this.generateAuthHeader()
          }
        }
      );

      return response.data.SearchResult.Items.map(this.mapSearchResult);
    } catch (error) {
      throw new StoreError(
        'Failed to search Amazon products',
        this.name,
        'SEARCH_ERROR'
      );
    }
  }

  private extractAsin(url: string): string {
    const match = url.match(/\/dp\/([A-Z0-9]{10})/);
    if (!match) throw new Error('Invalid Amazon URL');
    return match[1];
  }

  private generateAuthHeader(): string {
    // Implementation of Amazon's authentication signature
    return '';
  }

  private mapSearchResult(item: any): StoreProduct {
    return {
      id: item.ASIN,
      name: item.ItemInfo.Title.DisplayValue,
      price: item.Offers?.Listings[0]?.Price?.Amount,
      currency: item.Offers?.Listings[0]?.Price?.Currency || 'USD',
      url: item.DetailPageURL,
      store: 'Amazon',
      inStock: item.Offers?.Listings[0]?.Availability?.Type === 'Now'
    };
  }
}