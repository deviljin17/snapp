import React, { useState } from 'react';
import { Heart } from 'lucide-react';

type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';
type Color = 'orange' | 'brown' | 'blue';

interface ColorOption {
  name: Color;
  class: string;
}

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS: ColorOption[] = [
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'brown', class: 'bg-amber-800' },
  { name: 'blue', class: 'bg-blue-500' },
];

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [selectedColor, setSelectedColor] = useState<Color>('orange');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80"
            alt="Product"
            className="w-full rounded-lg object-cover aspect-square"
          />
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
            <Heart className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">Urban Jacket</h1>
          <p className="mt-2 text-2xl text-gray-900">$164.00</p>

          {/* Size Selector */}
          <div className="mt-8">
            <h2 className="text-sm font-medium text-gray-900">Size</h2>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    py-2 text-sm font-medium rounded-md border
                    ${selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="mt-8">
            <h2 className="text-sm font-medium text-gray-900">Color</h2>
            <div className="flex space-x-2 mt-2">
              {COLORS.map(({ name, class: colorClass }) => (
                <button
                  key={name}
                  onClick={() => setSelectedColor(name)}
                  className={`
                    w-8 h-8 rounded-full ${colorClass}
                    ${selectedColor === name ? 'ring-2 ring-offset-2 ring-black' : ''}
                  `}
                  aria-label={`Color ${name}`}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="mt-8 text-gray-600">
            Our designers have created the perfect jacket in street style. It is made of waterproof material,
            which is well suited for walking in any weather. The jacket has many pockets and a hood.
          </p>

          {/* Buy Button */}
          <button className="mt-8 w-full bg-black text-white py-4 rounded-md hover:bg-gray-900 transition-colors">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;