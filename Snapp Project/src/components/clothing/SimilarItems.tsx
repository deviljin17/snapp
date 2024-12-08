import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface SimilarItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  confidence: number;
}

const mockItems: SimilarItem[] = [
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

const SimilarItems = () => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Items Found</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
                aria-label="Add to favorites"
              >
                <Heart className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/80 text-white text-xs">
                {item.confidence}% match
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
              <div className="flex items-center justify-between">
                <span className="font-medium">${item.price}</span>
                <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimilarItems;