import React from 'react';
import { Shirt } from 'lucide-react';
import Link from 'next/link';
import CartButton from '@/components/cart/CartButton';
import FilterBar from '@/components/clothing/FilterBar';
import ImageUpload from '@/components/clothing/ImageUpload';
import SimilarItems from '@/components/clothing/SimilarItems';
import { useImageCapture } from '@/hooks/useImageCapture';

export default function ClothingPage() {
  const { showResults } = useImageCapture();

  const handleFilterChange = (category: string) => {
    console.log('Filter changed:', category);
  };

  const handleSortChange = (sort: string) => {
    console.log('Sort changed:', sort);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shirt className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900">StyleRo</span>
            </Link>
            
            <div className="flex items-center">
              <CartButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Similar Styles
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload an image of any clothing item and our AI will find similar styles from thousands of brands
          </p>
        </div>
        
        <div className="space-y-8">
          <ImageUpload />
          
          {showResults && (
            <>
              <div className="mt-12 border-t pt-8">
                <FilterBar 
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                />
              </div>
              <SimilarItems />
            </>
          )}
        </div>
      </main>
    </div>
  );
}