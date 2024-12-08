import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Ruler, ChevronDown } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    description: string;
    sizes: string[];
    colors: Array<{ name: string; value: string }>;
  };
  onClose: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const { addFavorite, isFavorite } = useFavorites();
  const [showSizeGuide, setShowSizeGuide] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => addFavorite(product)}
                className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors ${
                  isFavorite(product.id) ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-gray-500">{product.brand}</p>
                <p className="text-xl font-bold mt-2">${product.price}</p>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Select Size</h3>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-sm text-indigo-600 flex items-center gap-1"
                  >
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-medium mb-2">Select Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor === color.name
                          ? 'border-black scale-110'
                          : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600">{product.description}</p>

              {/* Add to Cart */}
              <button
                disabled={!selectedSize || !selectedColor}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;