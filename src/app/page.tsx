'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import PokemonList from '@/components/PokemonList';
import SearchFilters from '@/components/SearchFilters';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--background)' }}>
      <header className="theme-header shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Pokémon Explorer</h1>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Discover and explore your favorite Pokémon</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/favorites"
                className="flex items-center px-4 py-2 transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Favorites
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchFilters />
          <PokemonList />
        </Suspense>
      </main>
    </div>
  );
}
