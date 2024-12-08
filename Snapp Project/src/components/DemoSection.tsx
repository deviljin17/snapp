import React from 'react';
import { Search } from 'lucide-react';

const DemoSection = () => {
  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            See how it works
          </h2>
          <p className="text-lg text-gray-600">
            From inspiration to purchase in seconds
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[320px]">
          <div className="relative rounded-[3rem] bg-black p-4 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-black rounded-b-3xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden bg-white aspect-[9/19.5]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full px-4">
                  <div className="animate-pulse space-y-8">
                    <div className="h-64 bg-gray-200 rounded-xl" />
                    <div className="flex items-center justify-center">
                      <Search className="w-8 h-8 text-indigo-600 animate-bounce" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;