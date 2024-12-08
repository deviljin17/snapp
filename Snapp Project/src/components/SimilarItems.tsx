import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Item {
  id: number;
  image: string;
  title: string;
  price: number;
  store: string;
  url: string;
}

// Simulated similar items data
const similarItems: Item[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
    title: 'Knit Sweater',
    price: 89.99,
    store: 'StyleRo',
    url: '#'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    title: 'Casual Jacket',
    price: 129.99,
    store: 'FashionHub',
    url: '#'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    title: 'Denim Wear',
    price: 79.99,
    store: 'DenimCo',
    url: '#'
  }
];

const SimilarItems = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Similar Items</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
              <p className="text-gray-600">{item.store}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold">${item.price}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  View
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarItems;