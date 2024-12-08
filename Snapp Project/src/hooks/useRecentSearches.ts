import { useState, useEffect } from 'react';

export interface SearchResult {
  id: string;
  imageUrl: string;
  timestamp: number;
  matches: {
    id: number;
    name: string;
    image: string;
    confidence: number;
  }[];
}

export const useRecentSearches = () => {
  const [searches, setSearches] = useState<SearchResult[]>(() => {
    const saved = localStorage.getItem('stylero_searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('stylero_searches', JSON.stringify(searches));
  }, [searches]);

  const addSearch = (search: Omit<SearchResult, 'id' | 'timestamp'>) => {
    setSearches(prev => {
      const newSearch = {
        ...search,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      return [newSearch, ...prev.slice(0, 9)]; // Keep last 10 searches
    });
  };

  const clearSearches = () => {
    setSearches([]);
  };

  return { searches, addSearch, clearSearches };
};