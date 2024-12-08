import React from 'react';
import { Camera, Sparkles, ShoppingBag } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Snap any clothing',
    description: 'Take a photo of any clothing item you love, online or in the real world'
  },
  {
    icon: Sparkles,
    title: 'AI-powered matching',
    description: 'Our advanced AI finds the closest matches across thousands of products'
  },
  {
    icon: ShoppingBag,
    title: 'Shop from 1000+ brands',
    description: 'Compare prices and styles from the biggest fashion retailers worldwide'
  }
];

const ValueProposition = () => {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValueProposition;