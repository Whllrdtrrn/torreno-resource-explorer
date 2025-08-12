import { useState, useEffect, useMemo } from 'react';

const FAVORITES_KEY = 'pokemon-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[];
        setFavorites(new Set(favoriteIds));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const toggleFavorite = (pokemonId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(pokemonId)) {
        newFavorites.delete(pokemonId);
      } else {
        newFavorites.add(pokemonId);
      }
      
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
      
      return newFavorites;
    });
  };

  const isFavorite = (pokemonId: number) => favorites.has(pokemonId);

  const favoritesArray = useMemo(() => [...favorites], [favorites]);

  return {
    favorites: favoritesArray,
    toggleFavorite,
    isFavorite,
  };
}