import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ExternalLink } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ isOpen, onClose }) => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-medium">Favorites</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-64px)]">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Heart className="w-12 h-12 mb-4 stroke-1" />
                  <p>No favorites yet</p>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-2 gap-4">
                  {favorites.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-white rounded-lg overflow-hidden border"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover image-enhancement"
                        />
                        <button
                          onClick={() => removeFavorite(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">${item.price}</span>
                          <button className="p-1.5 hover:bg-gray-100 rounded-full">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};