import { useState } from 'react';

export interface ProductVariant {
  size: string;
  color: string;
}

export const useProductInteraction = (initialSize = 'M', initialColor = 'default') => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>({
    size: initialSize,
    color: initialColor
  });

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const updateVariant = (updates: Partial<ProductVariant>) => {
    setSelectedVariant(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    isFavorite,
    selectedVariant,
    toggleFavorite,
    updateVariant
  };
};