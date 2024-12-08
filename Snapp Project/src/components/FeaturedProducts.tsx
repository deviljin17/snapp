import React from 'react';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    title: 'Urban Jacket',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Classic Denim',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Casual Sweater',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Summer Dress',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80'
  }
];

const FeaturedProducts = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;