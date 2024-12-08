import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterBarProps {
  filters: {
    priceRange: [number, number];
    category?: string;
    brand?: string;
    color?: string;
    sustainability?: string[];
    sortBy: string;
  };
  onFilterChange: (filters: Partial<FilterBarProps['filters']>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Category
          <ChevronDown className="w-4 h-4" />
        </button>
        <select 
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          <option value="relevance">Most Relevant</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.category && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
          >
            {filters.category}
          </motion.div>
        )}
        {filters.brand && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
          >
            {filters.brand}
          </motion.div>
        )}
        {filters.sustainability?.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
          >
            Eco-Friendly
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;