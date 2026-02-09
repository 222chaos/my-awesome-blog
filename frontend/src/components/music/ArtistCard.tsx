'use client';

import { cn } from '@/lib/utils';
import type { Artist } from '@/types/music';

interface ArtistCardProps {
  artist: Artist;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export default function ArtistCard({ artist, size = 'medium', onClick }: ArtistCardProps) {
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  return (
    <div 
      className={cn(
        'group cursor-pointer transition-all duration-300 ease-out',
        'hover:-translate-y-1'
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          'rounded-full overflow-hidden shadow-md transition-shadow duration-300',
          'group-hover:shadow-lg',
          sizeClasses[size]
        )}
      >
        <img 
          src={artist.avatar} 
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 text-center">
        <h3 className="font-sf-pro-text text-headline text-black dark:text-white truncate">
          {artist.name}
        </h3>
        {artist.fans && (
          <p className="font-sf-pro-text text-caption-1 text-black/60 dark:text-white/60">
            {formatFans(artist.fans)}
          </p>
        )}
      </div>
    </div>
  );
}

function formatFans(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万粉丝`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}千粉丝`;
  }
  return `${count}粉丝`;
}
