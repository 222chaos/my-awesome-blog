'use client';

import { cn } from '@/lib/utils';
import PlaylistCard from './PlaylistCard';
import type { Playlist } from '@/types/music';

interface PlaylistScrollProps {
  playlists: Playlist[];
  size?: 'small' | 'medium' | 'large';
  showPlayCount?: boolean;
  onPlaylistClick?: (playlist: Playlist) => void;
}

export default function PlaylistScroll({ 
  playlists, 
  size = 'medium',
  showPlayCount = true,
  onPlaylistClick 
}: PlaylistScrollProps) {
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
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="flex-shrink-0 snap-start"
          >
            <PlaylistCard 
              playlist={playlist}
              size={size}
              showPlayCount={showPlayCount}
              onPlay={() => onPlaylistClick?.(playlist)}
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
