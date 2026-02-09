'use client';

import { cn } from '@/lib/utils';
import type { Playlist } from '@/types/music';

interface PlaylistCardProps {
  playlist: Playlist;
  size?: 'small' | 'medium' | 'large';
  showPlayCount?: boolean;
  onPlay?: () => void;
}

export default function PlaylistCard({ 
  playlist, 
  size = 'medium',
  showPlayCount = true,
  onPlay
}: PlaylistCardProps) {
  const sizeClasses = {
    small: 'w-40 h-40',
    medium: 'w-48 h-48',
    large: 'w-56 h-56',
  };

  const coverSize = {
    small: 'w-40 h-40',
    medium: 'w-48 h-48',
    large: 'w-56 h-56',
  };

  return (
    <div 
      className={cn(
        'group relative cursor-pointer transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:scale-102'
      )}
      onClick={onPlay}
    >
      <div className={cn(
        'rounded-2xl overflow-hidden shadow-md transition-shadow duration-300',
        'group-hover:shadow-lg',
        coverSize[size]
      )}>
        <img 
          src={playlist.coverImg} 
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        <button 
          className="absolute bottom-2 right-2 w-12 h-12 bg-[#fa2d2f] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 transform translate-y-full group-hover:translate-y-0"
          aria-label="播放"
        >
          <span className="text-xl ml-1">▶️</span>
        </button>
      </div>

      <div className="mt-3">
        <h3 className="font-sf-pro-text text-headline text-black dark:text-white truncate mb-1">
          {playlist.name}
        </h3>
        {playlist.creator && (
          <p className="font-sf-pro-text text-caption-1 text-black/60 dark:text-white/60 truncate">
            {playlist.creator}
          </p>
        )}
      </div>

      {showPlayCount && (
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
          <span className="text-sm">🎧</span>
          <span className="font-sf-pro-text text-caption-1 text-white">
            {playlist.playCount}
          </span>
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
        <span className="font-sf-pro-text text-caption-1 text-white">
          {playlist.trackCount}首
        </span>
      </div>
    </div>
  );
}
