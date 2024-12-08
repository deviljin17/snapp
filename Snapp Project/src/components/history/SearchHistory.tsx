import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, Trash2, X } from 'lucide-react';
import { getSearchHistory, clearHistory } from '@/utils/history';
import { useNavigate } from 'react-router-dom';

const SearchHistory = () => {
  const [history, setHistory] = React.useState(getSearchHistory());
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleReSearch = (imageUrl: string) => {
    // Implement re-search logic here
    navigate('/scanning');
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(timestamp));
  };

  if (history.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-900 transition-colors"
      >
        <Clock className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50"
            />

            {/* History Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-20 right-4 w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium">Recent Searches</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearHistory}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="p-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt="Search"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formatDate(item.timestamp)}
                          </span>
                          <button
                            onClick={() => handleReSearch(item.imageUrl)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex gap-2">
                          {item.matches.slice(0, 3).map((match) => (
                            <div
                              key={match.id}
                              className="relative w-12 h-12 rounded-md overflow-hidden group"
                            >
                              <img
                                src={match.image}
                                alt={match.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                {match.confidence}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchHistory;