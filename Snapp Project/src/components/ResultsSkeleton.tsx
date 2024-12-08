import React from 'react';

const ResultsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
      
      <div className="mt-8 space-y-4">
        <div className="h-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default ResultsSkeleton;