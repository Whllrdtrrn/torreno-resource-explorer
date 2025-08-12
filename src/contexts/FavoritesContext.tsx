'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const FAVORITES_KEY = 'pokemon-favorites';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoritesSet, setFavoritesSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[];
        setFavoritesSet(new Set(favoriteIds));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const toggleFavorite = (pokemonId: number) => {
    setFavoritesSet(prev => {
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

  const isFavorite = (pokemonId: number) => favoritesSet.has(pokemonId);

  const favorites = [...favoritesSet];

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}