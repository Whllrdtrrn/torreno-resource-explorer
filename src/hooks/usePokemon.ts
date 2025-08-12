'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Pokemon, SearchParams } from '@/lib/types';
import { fetchPokemonList, fetchPokemonDetail, searchPokemonByName, ApiError } from '@/lib/api';
import { getPokemonIdFromUrl } from '@/lib/utils';

interface UsePokemonResult {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  retry: () => void;
}

export function usePokemon(params: SearchParams): UsePokemonResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { q, type, sort, page = 1 } = params;
  const limit = 20;
  const offset = (page - 1) * limit;

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    try {
      if (q || (type && type !== 'all')) {
        // When searching or filtering by type, get a larger batch to filter from
        const batchSize = 1000;
        const response = await fetchPokemonList(batchSize, 0, signal);
        
        let allPokemon = response.results.map(p => ({
          ...p,
          id: getPokemonIdFromUrl(p.url)
        }));

        // If there's a search query, filter by name first
        if (q) {
          // First try exact match
          const exactMatch = await searchPokemonByName(q, signal);
          if (exactMatch && (!type || type === 'all')) {
            // If exact match and no type filter, return just that
            setPokemon([{
              id: exactMatch.id,
              name: exactMatch.name,
              url: `https://pokeapi.co/api/v2/pokemon/${exactMatch.id}/`
            }]);
            setTotal(1);
            setHasMore(false);
            return;
          }
          
          // Filter by name (partial matches)
          allPokemon = allPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(q.toLowerCase())
          );
        }

        // If there's a type filter, fetch details and filter by type
        if (type && type !== 'all') {
          const detailedPokemon = await Promise.all(
            allPokemon.map(async (p) => {
              try {
                const detail = await fetchPokemonDetail(p.id, signal);
                return {
                  id: p.id,
                  name: p.name,
                  url: p.url,
                  types: detail.types.map(t => t.type.name)
                };
              } catch {
                return null;
              }
            })
          );
          
          allPokemon = detailedPokemon
            .filter((p): p is Pokemon & { types: string[] } => 
              p !== null && p.types.includes(type)
            )
            .map(p => ({ id: p.id, name: p.name, url: p.url }));
        }

        // Apply sorting
        if (sort === 'name') {
          allPokemon.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPokemon = allPokemon.slice(startIndex, endIndex);

        setPokemon(paginatedPokemon);
        setTotal(allPokemon.length);
        setHasMore(endIndex < allPokemon.length);
      } else {
        // Normal pagination without type filtering
        const response = await fetchPokemonList(limit, offset, signal);
        
        let pokemonList = response.results.map(p => ({
          ...p,
          id: getPokemonIdFromUrl(p.url)
        }));

        if (sort === 'name') {
          pokemonList.sort((a, b) => a.name.localeCompare(b.name));
        }

        setPokemon(pokemonList);
        setTotal(response.count);
        setHasMore(response.next !== null);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Failed to fetch Pokémon data';
      setError(errorMessage);
      setPokemon([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [q, type, sort, page, limit, offset]);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const retry = () => {
    fetchData();
  };

  return {
    pokemon,
    loading,
    error,
    total,
    hasMore,
    retry,
  };
}