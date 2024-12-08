import React, { useState, useEffect } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import NavigationButton from './NavigationButton';
import ResultsSkeleton from './ResultsSkeleton';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  confidence: number;
}

interface ResultsPageProps {
  onBack: () => void;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Classic Denim Jacket",
    brand: "StyleCo",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80",
    confidence: 98
  },
  {
    id: 2,
    name: "Vintage Wash Jacket",
    brand: "DenimLab",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80",
    confidence: 92
  },
  {
    id: 3,
    name: "Urban Streetwear Jacket",
    brand: "UrbanEdge",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80",
    confidence: 87
  },
  {
    id: 4,
    name: "Modern Denim Jacket",
    brand: "FutureWear",
    price: 139.99,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80",
    confidence: 85
  }
];

const ResultsPage: React.FC<ResultsPageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="px-4 h-16 flex items-center justify-between">
          <NavigationButton onClick={onBack} />
          <h1 className="font-medium">AI Results</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-2xl mx-auto p-4">
        {isLoading ? (
          <ResultsSkeleton />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group relative animate-fade-in"
                  style={{
                    animationDelay: `${product.id * 100}ms`
                  }}
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <button 
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors hover:text-red-500"
                      aria-label="Add to favorites"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{product.brand}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-medium">${product.price}</span>
                      <button 
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="View product"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Confidence Section */}
            <div className="mt-8 p-4 bg-indigo-50 rounded-lg animate-fade-up">
              <h2 className="text-sm font-medium text-indigo-900 mb-2">
                AI Match Confidence
              </h2>
              <div className="space-y-2">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center">
                    <div className="flex-1">
                      <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                          style={{ width: `${product.confidence}%` }}
                        />
                      </div>
                    </div>
                    <span className="ml-2 text-xs text-indigo-900">
                      {product.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* View More Button */}
            <div className="mt-6 text-center">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition-colors">
                View More Results
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;