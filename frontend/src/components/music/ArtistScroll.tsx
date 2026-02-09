'use client';

import { cn } from '@/lib/utils';
import ArtistCard from './ArtistCard';
import type { Artist } from '@/types/music';

interface ArtistScrollProps {
  artists: Artist[];
  size?: 'small' | 'medium' | 'large';
  onArtistClick?: (artist: Artist) => void;
}

export default function ArtistScroll({ 
  artists, 
  size = 'medium',
  onArtistClick 
}: ArtistScrollProps) {
  return (
    <div className="relative group">
      <div 
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {artists.map((artist) => (
          <div 
            key={artist.id} 
            className="flex-shrink-0 snap-start"
          >
            <ArtistCard 
              artist={artist}
              size={size}
              onClick={() => onArtistClick?.(artist)}
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
