import React, { useEffect } from 'react';
import { ArrowLeft, Camera, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterBar from './FilterBar';
import ComparisonGrid from './ComparisonGrid';
import PageTransition from '../transitions/PageTransition';
import ShareButton from './ShareButton';
import SearchHistory from '../history/SearchHistory';
import ResultsGuide from './ResultsGuide';
import ErrorMessage from '../ui/ErrorMessage';
import { ERROR_MESSAGES } from '../../utils/errors';

const ComparisonResults = () => {
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 500]);
  const [selectedStore, setSelectedStore] = React.useState('');
  const [sortBy, setSortBy] = React.useState('match');
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [totalResults, setTotalResults] = React.useState(0);
  const [error, setError] = React.useState<import('@/utils/errors').ErrorState | null>(null);

  useEffect(() => {
    // Simulate store availability issues
    if (Math.random() < 0.2) {
      setError({
        type: 'results',
        code: 'store_unavailable',
        ...ERROR_MESSAGES.results.store_unavailable
      });
    }
  }, []);

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
    updateActiveFilters('price', `$${range[0]} - $${range[1]}`);
  };

  const handleStoreChange = (store: string) => {
    setSelectedStore(store);
    if (store) {
      updateActiveFilters('store', store);
    } else {
      removeFilter('store');
    }
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const updateActiveFilters = (type: string, value: string) => {
    setActiveFilters(prev => {
      const filtered = prev.filter(f => !f.startsWith(type + ':'));
      return [...filtered, `${type}:${value}`];
    });
  };

  const removeFilter = (type: string) => {
    setActiveFilters(prev => prev.filter(f => !f.startsWith(type + ':')));
  };

  const handleClearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedStore('');
    setSortBy('match');
    setActiveFilters([]);
  };
  const handleResultsUpdate = (count: number) => {
    setTotalResults(count);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {error && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <ErrorMessage
              error={error}
              onRetry={() => setError(null)}
            />
          </div>
        )}
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="max-w-7xl mx-auto">
            <div className="px-4 h-16 flex items-center justify-between">
              <Link
                to="/camera"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-lg font-medium">Similar Styles Found</h1>
              <ShareButton matches={[]} />
            </div>
          </div>
        </div>

        {/* AI Match Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Match Results</p>
                <p className="text-xs opacity-80">Found similar items across multiple stores</p>
              </div>
              <Link
                to="/camera"
                className="px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors flex items-center gap-1"
              >
                <Camera className="w-4 h-4" />
                Try Another
              </Link>
            </div>
          </div>
        </div>

        <FilterBar
          priceRange={priceRange}
          selectedStore={selectedStore}
          sortBy={sortBy}
          activeFilters={activeFilters}
          totalResults={totalResults}
          onPriceChange={handlePriceChange}
          onStoreChange={handleStoreChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          onRemoveFilter={removeFilter}
          availableFilters={{
            categories: ['tops', 'bottoms', 'dresses'],
            counts: {
              tops: 15,
              bottoms: 8,
              dresses: 12
            }
          }}
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {!localStorage.getItem('results_guide_seen') && <ResultsGuide />}
          <ComparisonGrid onResultsUpdate={handleResultsUpdate} />
        </div>
      </div>
    </PageTransition>
  );
};

export default ComparisonResults;