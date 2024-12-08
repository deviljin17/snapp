interface SearchHistoryItem {
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

const HISTORY_KEY = 'stylero_search_history';

export const getSearchHistory = (): SearchHistoryItem[] => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToHistory = (item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
  const history = getSearchHistory();
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  
  const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20 searches
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return newItem;
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};