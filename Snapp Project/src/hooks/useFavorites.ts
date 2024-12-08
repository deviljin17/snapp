import { useState, useEffect } from 'react';

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  timestamp: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem('stylero_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('stylero_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item: Omit<FavoriteItem, 'timestamp'>) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id)) return prev;
      return [{ ...item, timestamp: Date.now() }, ...prev];
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const isFavorite = (id: number) => favorites.some(f => f.id === id);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};