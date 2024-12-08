import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onSortChange }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Category
          <ChevronDown className="w-4 h-4" />
        </button>
        <select 
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;