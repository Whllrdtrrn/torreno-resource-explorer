import Image from 'next/image';
import Link from 'next/link';
import { Pokemon } from '@/lib/types';
import { formatPokemonName, formatPokemonId } from '@/lib/utils';
import { useFavorites } from '@/contexts/FavoritesContext';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="theme-card rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group">
        <div className="relative aspect-square p-4" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))' }}>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-10 p-2 rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className="w-5 h-5"
              style={{ color: isFav ? '#ef4444' : 'var(--text-muted)' }}
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
          </button>
          
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={formatPokemonName(pokemon.name)}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-200"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            {formatPokemonId(pokemon.id)}
          </div>
          <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
            {formatPokemonName(pokemon.name)}
          </h3>
        </div>
      </div>
    </Link>
  );
}