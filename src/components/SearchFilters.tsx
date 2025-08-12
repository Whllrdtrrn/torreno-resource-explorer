'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from '@/lib/utils';

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState('');

  // Initialize search value from URL
  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  // Create a stable debounced function
  const debouncedUpdateSearch = useMemo(
    () => debounce((value: string) => {
      const params = new URLSearchParams(window.location.search);
      const trimmedValue = value.trim();
      
      // Only search if value is at least 2 characters or empty (to clear search)
      if (trimmedValue.length >= 2 || trimmedValue === '') {
        if (trimmedValue) {
          params.set('q', trimmedValue);
        } else {
          params.delete('q');
        }
        params.delete('page');
        router.push(`/?${params.toString()}`);
      }
    }, 300),
    [router]
  );

  // Trigger search when user types
  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    if (searchValue !== currentQuery) {
      debouncedUpdateSearch(searchValue);
    }
  }, [searchValue, debouncedUpdateSearch, searchParams]);

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort === 'name') {
      params.set('sort', 'name');
    } else {
      params.delete('sort');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type && type !== 'all') {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const currentSort = searchParams.get('sort') || 'id';
  const currentType = searchParams.get('type') || 'all';

  return (
    <div className="theme-card rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex-1 max-w-md">
          <label htmlFor="search" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Search Pokémon
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name (min. 2 characters)..."
              className="theme-input w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Sort by
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="theme-input block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Type
            </label>
            <select
              id="type"
              value={currentType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="theme-input block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="normal">Normal</option>
              <option value="fire">Fire</option>
              <option value="water">Water</option>
              <option value="electric">Electric</option>
              <option value="grass">Grass</option>
              <option value="ice">Ice</option>
              <option value="fighting">Fighting</option>
              <option value="poison">Poison</option>
              <option value="ground">Ground</option>
              <option value="flying">Flying</option>
              <option value="psychic">Psychic</option>
              <option value="bug">Bug</option>
              <option value="rock">Rock</option>
              <option value="ghost">Ghost</option>
              <option value="dragon">Dragon</option>
              <option value="dark">Dark</option>
              <option value="steel">Steel</option>
              <option value="fairy">Fairy</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}