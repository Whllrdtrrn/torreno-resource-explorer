'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PokemonDetail } from '@/lib/types';
import { fetchPokemonDetail, ApiError } from '@/lib/api';
import { formatPokemonName, formatPokemonId } from '@/lib/utils';
import { useFavorites } from '@/contexts/FavoritesContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = pokemon ? isFavorite(pokemon.id) : false;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPokemonDetail(id);
      setPokemon(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Failed to fetch Pokémon details';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message="Pokémon not found" />
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };

  return (
    <div className="min-h-screen transition-colors" style={{backgroundColor: 'var(--background)'}}>
      <header className="theme-header shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              style={{color: 'var(--text-secondary)'}}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <button
              onClick={() => toggleFavorite(pokemon.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isFav 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg
                className={`w-5 h-5 mr-2 ${isFav ? 'fill-current' : ''}`}
                fill={isFav ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden theme-card">
          <div className="lg:flex theme-card rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group">
            <div className="lg:w-1/2 p-8" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))' }}>
              <div className="aspect-square relative max-w-sm mx-auto">
                <Image
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={formatPokemonName(pokemon.name)}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="lg:w-1/2 p-8">
              <div className="mb-6">
                <div className="text-lg text-gray-500 font-medium mb-2">
                  {formatPokemonId(pokemon.id)}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ color: 'var(--text-primary)' }}>
                  {formatPokemonName(pokemon.name)}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                        typeColors[type.type.name] || 'bg-gray-400'
                      }`}
                    >
                      {formatPokemonName(type.type.name)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1" style={{ color: 'var(--text-primary)' }}>Height</h3>
                  <p className="text-lg font-semibold text-gray-900" style={{ color: 'var(--text-primary)' }}>
                    {(pokemon.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1" style={{ color: 'var(--text-primary)' }}>Weight</h3>
                  <p className="text-lg font-semibold text-gray-900" style={{ color: 'var(--text-primary)' }}>
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1" style={{ color: 'var(--text-primary)' }}>Base Experience</h3>
                  <p className="text-lg font-semibold text-gray-900" style={{ color: 'var(--text-primary)' }}>
                    {pokemon.base_experience}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: 'var(--text-primary)' }}>Abilities</h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability.ability.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">
                        {formatPokemonName(ability.ability.name)}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: 'var(--text-primary)' }}>Base Stats</h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700" style={{ color: 'var(--text-primary)' }}>
                          {formatPokemonName(stat.stat.name.replace('-', ' '))}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {stat.base_stat}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}