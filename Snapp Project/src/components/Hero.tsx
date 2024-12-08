import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[70vh] bg-gray-900">
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80"
        alt="Fashion Hero"
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">New Collection</h1>
          <p className="text-lg md:text-xl mb-8">Discover your style</p>
          <button className="bg-white text-black px-8 py-3 rounded-full font-medium flex items-center gap-2 mx-auto hover:bg-gray-100 transition-colors">
            Shop Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;