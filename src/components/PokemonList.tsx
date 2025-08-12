'use client';

import { useSearchParams } from 'next/navigation';
import { usePokemon } from '@/hooks/usePokemon';
import PokemonCard from './PokemonCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import Pagination from './Pagination';
import { SearchParams } from '@/lib/types';

export default function PokemonList() {
  const searchParams = useSearchParams();
  
  const params: SearchParams = {
    q: searchParams.get('q') || undefined,
    type: searchParams.get('type') || undefined,
    sort: (searchParams.get('sort') as 'name' | 'id') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const { pokemon, loading, error, total, hasMore, retry } = usePokemon(params);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={retry}
      />
    );
  }

  if (pokemon.length === 0) {
    const isSearching = params.q || (params.type && params.type !== 'all');
    return (
      <div className="text-center py-12">
        <div className="mb-4" style={{ color: 'var(--text-muted)' }}>
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.821-6.131-2.185M6.115 5.19A9.955 9.955 0 0112 3c4.262 0 7.972 2.733 9.338 6.533-1.8 4.946-6.441 8.467-11.338 8.467-2.222 0-4.294-.543-6.115-1.467"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {isSearching ? 'No Pokémon found' : 'No Pokémon available'}
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isSearching 
            ? 'Try adjusting your search or filters'
            : 'Unable to load Pokémon data at this time'
          }
        </p>
      </div>
    );
  }

  const currentPage = params.page || 1;
  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
        />
      )}
    </div>
  );
}