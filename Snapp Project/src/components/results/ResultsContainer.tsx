import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FilterBar from './FilterBar';
import ResultsGrid from './ResultsGrid';
import ResultsHeader from './ResultsHeader';
import { useSearchParams } from 'react-router-dom';

interface FilterState {
  priceRange: [number, number];
  category?: string;
  brand?: string;
  color?: string;
  sustainability?: string[];
  sortBy: 'price_asc' | 'price_desc' | 'relevance';
}

const ResultsContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    sortBy: 'relevance'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize filters from URL params
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const color = searchParams.get('color');
    const sortBy = searchParams.get('sort') as FilterState['sortBy'];
    
    if (category || brand || color || sortBy) {
      setFilters(prev => ({
        ...prev,
        ...(category && { category }),
        ...(brand && { brand }),
        ...(color && { color }),
        ...(sortBy && { sortBy })
      }));
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Update URL params
      setSearchParams({
        ...(updated.category && { category: updated.category }),
        ...(updated.brand && { brand: updated.brand }),
        ...(updated.color && { color: updated.color }),
        ...(updated.sortBy && { sort: updated.sortBy })
      });
      
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ResultsHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <ResultsGrid
            filters={filters}
            isLoading={isLoading}
            onLoadingChange={setIsLoading}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default ResultsContainer;