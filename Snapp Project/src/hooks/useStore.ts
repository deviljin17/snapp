import { useState } from 'react';
import { logger } from '@/utils/logger';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  confidence: number;
  stores: Array<{
    name: string;
    price: number;
    url: string;
    inStock: boolean;
  }>;
}

interface FilterOptions {
  priceRange?: [number, number];
  category?: string;
  brand?: string;
  color?: string;
  sustainability?: string[];
  sortBy?: string;
}

export const useStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (filters: FilterOptions) => {
    setIsLoading(true);
    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockProducts = [
        {
          id: '1',
          name: 'Urban Jacket',
          brand: 'StyleCo',
          price: 129.99,
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80',
          confidence: 98,
          stores: [
            { name: 'Fashion Hub', price: 129.99, url: '#', inStock: true },
            { name: 'Style Store', price: 149.99, url: '#', inStock: true }
          ]
        },
        {
          id: '2',
          name: 'Classic Denim',
          brand: 'DenimLab',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',
          confidence: 92,
          stores: [
            { name: 'Urban Store', price: 89.99, url: '#', inStock: true },
            { name: 'Fashion Mall', price: 99.99, url: '#', inStock: true }
          ]
        }
      ];
      
      setProducts(mockProducts);
      
      logger.info('store', 'Products fetched successfully', {
        count: mockProducts.length,
        filters
      });
    } catch (error) {
      logger.error('store', 'Failed to fetch products', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    fetchProducts
  };
};