import { PokemonListResponse, PokemonDetail, PokemonTypeResponse } from './types';
import { cache } from './cache';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout');
    }
    throw error;
  }
}

export async function fetchPokemonList(
  limit = 20,
  offset = 0,
  signal?: AbortSignal
): Promise<PokemonListResponse> {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetchWithTimeout(url, { signal });
  return response.json();
}

export async function fetchPokemonDetail(
  id: string | number,
  signal?: AbortSignal
): Promise<PokemonDetail> {
  const cacheKey = `pokemon-detail-${id}`;
  const cached = cache.get<PokemonDetail>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const url = `${BASE_URL}/pokemon/${id}`;
  const response = await fetchWithTimeout(url, { signal });
  const data = await response.json();
  
  cache.set(cacheKey, data);
  return data;
}

export async function fetchPokemonTypes(signal?: AbortSignal): Promise<PokemonTypeResponse> {
  const url = `${BASE_URL}/type`;
  const response = await fetchWithTimeout(url, { signal });
  return response.json();
}

export async function searchPokemonByName(
  name: string,
  signal?: AbortSignal
): Promise<PokemonDetail | null> {
  try {
    const url = `${BASE_URL}/pokemon/${name.toLowerCase()}`;
    const response = await fetchWithTimeout(url, { signal });
    return response.json();
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return null; // Return null for not found or bad request, don't log errors
    }
    throw error;
  }
}