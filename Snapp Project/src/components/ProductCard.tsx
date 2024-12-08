import React from 'react';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, price }) => {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{title}</h3>
          <p className="mt-1 text-sm font-medium text-gray-900">${price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;