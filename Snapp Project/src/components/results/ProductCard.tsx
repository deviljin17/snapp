import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageWithFallback from '../ui/ImageWithFallback';

interface ProductCardProps {
  product: {
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
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const bestStore = product.stores.reduce((best, current) => 
    current.price < best.price ? current : best
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover image-enhancement"
        />
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors">
          <Heart className="w-4 h-4" />
        </button>
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/80 text-white text-xs">
          {product.confidence}% match
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {bestStore.name}
            </span>
            {bestStore === product.stores[0] && (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                Best Price
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">${bestStore.price}</span>
          <a
            href={bestStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;