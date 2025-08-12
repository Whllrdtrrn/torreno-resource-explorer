'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pokemon } from '@/lib/types';
import { fetchPokemonDetail } from '@/lib/api';
import { useFavorites } from '@/contexts/FavoritesContext';
import PokemonCard from '@/components/PokemonCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ThemeToggle from '@/components/ThemeToggle';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setFavoritePokemon([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const pokemonDetails = await Promise.all(
          favorites.map(async (id) => {
            const detail = await fetchPokemonDetail(id);
            return {
              id: detail.id,
              name: detail.name,
              url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`
            };
          })
        );
        setFavoritePokemon(pokemonDetails);
      } catch (error) {
        console.error('Error loading favorite Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--background)' }}>
      <header className="theme-header shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-x-4 gap-3">
              <Link
                href="/"
                style={{ color: 'var(--text-primary)' }}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Explorer
              </Link>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Favorite Pokémon</h1>
                <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : favoritePokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritePokemon.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start exploring and add some Pokémon to your favorites!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Explore Pokémon
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}