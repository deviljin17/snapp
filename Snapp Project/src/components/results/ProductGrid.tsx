import React from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from '../ui/ProductSkeleton';

const products = [
  {
    id: 1,
    name: "Urban Jacket",
    brand: "StyleCo",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80",
    confidence: 98
  },
  {
    id: 2,
    name: "Vintage Denim",
    brand: "DenimLab",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80",
    confidence: 92
  },
  {
    id: 3,
    name: "Classic Sweater",
    brand: "UrbanEdge",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80",
    confidence: 85
  },
  {
    id: 4,
    name: "Summer Jacket",
    brand: "FutureWear",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80",
    confidence: 82
  }
];

interface ProductGridProps {
  isLoading?: boolean;
}

const ProductGrid = ({ isLoading = false }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductGrid;