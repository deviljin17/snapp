import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductSkeleton from '../ui/ProductSkeleton';
import { useStore } from '@/hooks/useStore';

interface ResultsGridProps {
  filters: {
    priceRange?: [number, number];
    category?: string;
    brand?: string;
    color?: string;
    sustainability?: string[];
    sortBy?: string;
  };
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  filters,
  isLoading,
  onLoadingChange
}) => {
  const { products, fetchProducts } = useStore();

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        onLoadingChange(true);
        await fetchProducts(filters);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        onLoadingChange(false);
      }
    };

    loadProducts();
  }, [filters, fetchProducts, onLoadingChange]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ResultsGrid;