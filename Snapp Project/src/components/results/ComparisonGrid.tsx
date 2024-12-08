import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchDetails from './MatchDetails';
import ImageWithFallback from '../ui/ImageWithFallback';
import Tooltip from '@/components/ui/Tooltip';

import ProductSkeleton from '../ui/ProductSkeleton';

interface Product {
  id: number;
  name: string;
  brand: string;
  store: string;
  price: number;
  image: string;
  confidence: number;
  url: string;
  colorMatch: number;
  styleMatch: number;
  patternMatch: number;
  features: string[];
  delivery: string;
  returns: string;
  rating: number;
  category: string;
}

interface ComparisonGridProps {
  onResultsUpdate?: (count: number) => void;
}
const products: Product[] = [
  {
    id: 1,
    name: "Floral Maxi Dress",
    brand: "Anthropologie",
    store: "Fashion Hub",
    price: 168.00,
    image: "/images/card%201.jpeg",
    confidence: 98,
    url: "#",
    colorMatch: 95,
    styleMatch: 98,
    patternMatch: 92,
    features: ["Floral print", "Maxi length", "Adjustable waist", "Side pockets"],
    delivery: "Free 2-day shipping",
    returns: "30-day free returns",
    rating: 4.8
  },
  {
    id: 2,
    name: "Silk Evening Gown",
    brand: "Reformation",
    store: "Urban Store",
    price: 248.00,
    image: "/images/card%202.webp",
    confidence: 92,
    url: "#",
    colorMatch: 90,
    styleMatch: 92,
    patternMatch: 88,
    features: ["Silk fabric", "Off-shoulder", "Floor length", "Built-in boning"],
    delivery: "Standard shipping",
    returns: "14-day returns",
    rating: 4.5
  },
  {
    id: 3,
    name: "Linen Blazer",
    brand: "Massimo Dutti",
    store: "Fashion Mall",
    price: 189.00,
    image: "/images/card%203.webp",
    confidence: 85,
    url: "#",
    colorMatch: 85,
    styleMatch: 88,
    patternMatch: 82,
    features: ["Italian linen", "Tailored fit", "Mother of pearl buttons"],
    delivery: "Express shipping",
    returns: "30-day returns",
    rating: 4.6
  },
  {
    id: 4,
    name: "Cashmere Sweater",
    brand: "COS",
    store: "Style Store",
    price: 175.00,
    image: "/images/card%204.jpeg",
    confidence: 82,
    url: "#",
    colorMatch: 80,
    styleMatch: 85,
    patternMatch: 78,
    features: ["Pure cashmere", "Ribbed trim", "Relaxed fit"],
    delivery: "Next-day delivery",
    returns: "60-day returns",
    rating: 4.3
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    brand: "Madewell",
    store: "Premium Outlet",
    price: 128.00,
    image: "/images/card%205.jpeg",
    confidence: 78,
    url: "#",
    colorMatch: 75,
    styleMatch: 82,
    patternMatch: 76,
    features: ["Full-grain leather", "Adjustable strap", "Interior pockets"],
    delivery: "Premium shipping",
    returns: "45-day returns",
    rating: 4.7
  },
  {
    id: 6,
    name: "Wide-Leg Trousers",
    brand: "Arket",
    store: "Fashion Direct",
    price: 145.00,
    image: "/images/card%206.jpeg",
    confidence: 75,
    url: "#",
    colorMatch: 72,
    styleMatch: 78,
    patternMatch: 74,
    features: ["High-waisted", "Pleated front", "Italian wool"],
    delivery: "Standard shipping",
    returns: "30-day returns",
    rating: 4.4
  }
];

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ onResultsUpdate }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedProduct, setSelectedProduct] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      onResultsUpdate?.(products.length);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onResultsUpdate]);

  if (isLoading) {
    return (
      <div className="responsive-grid">
        {[...Array(6)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  const [selectedProduct, setSelectedProduct] = React.useState<number | null>(null);

  return (
    <div className="responsive-grid">
      {products.map((product, index) => (
        <motion.div 
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
        >
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.exactMatch && (
              <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-lg">
                Exact Match
              </span>
            )}
            {product.sustainability?.ecoFriendly && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
                Eco-Friendly
              </span>
            )}
          </div>
          <div className="relative aspect-square overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover image-enhancement transition-transform duration-700 group-hover:scale-110"
              fallbackText="Product image"
            />
            <div className="absolute top-2 left-2 px-3 py-1.5 rounded-full bg-black/90 text-white text-sm font-medium shadow-lg backdrop-blur-sm">
              {product.confidence}% match
            </div>
            <Tooltip content="View match details">
              <button
                onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          
          <AnimatePresence>
            {selectedProduct === product.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <MatchDetails
                  colorMatch={product.colorMatch}
                  styleMatch={product.styleMatch}
                  patternMatch={product.patternMatch}
                  features={product.features || []}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.brand}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-emerald-50 rounded-full text-sm font-medium text-emerald-700">
                  {product.store}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm font-medium text-gray-600">{product.rating} ★</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">${product.price}</span>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-black text-white text-sm rounded-full hover:bg-gray-900 transition-colors flex items-center gap-1"
              >
                Shop Now
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ComparisonGrid;