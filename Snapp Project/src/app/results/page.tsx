import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductGrid from '@/components/results/ProductGrid';
import PageTransition from '@/components/transitions/PageTransition';

export default function ResultsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="max-w-7xl mx-auto">
            <div className="px-4 h-16 flex items-center justify-between">
              <Link
                href="/camera"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-lg font-medium">Similar Styles Found</h1>
              <div className="w-10" /> {/* Spacer */}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ProductGrid />
        </div>
      </div>
    </PageTransition>
  );
}