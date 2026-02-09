'use client';

import { cn } from '@/lib/utils';
import type { Song } from '@/types/music';

interface SongRowProps {
  song: Song;
  index: number;
  isPlaying?: boolean;
  currentSong?: Song;
  showAlbum?: boolean;
  showDuration?: boolean;
  onSongClick?: (song: Song) => void;
  onDoubleClick?: (song: Song) => void;
}

export default function SongRow({ 
  song, 
  index,
  isPlaying = false,
  currentSong,
  showAlbum = false,
  showDuration = true,
  onSongClick,
  onDoubleClick
}: SongRowProps) {
  const isCurrentSong = currentSong?.id === song.id;

  return (
    <div 
      className={cn(
        'group flex items-center h-14 px-4 transition-colors duration-200 cursor-pointer',
        isCurrentSong && 'bg-gradient-to-r from-[#fa2d2f]/10 to-transparent border-l-3 border-[#fa2d2f]',
        !isCurrentSong && 'hover:bg-white/10 dark:hover:bg-white/5'
      )}
      onClick={() => onSongClick?.(song)}
      onDoubleClick={() => onDoubleClick?.(song)}
      role="button"
      tabIndex={0}
    >
      <div className="w-8 flex-shrink-0 flex items-center justify-center">
        {isCurrentSong && isPlaying ? (
          <div className="flex items-center gap-0.5">
            <div className="w-0.5 h-3 bg-[#fa2d2f] rounded-full animate-sound-wave"></div>
            <div className="w-0.5 h-4 bg-[#fa2d2f] rounded-full animate-sound-wave delay-75"></div>
            <div className="w-0.5 h-3 bg-[#fa2d2f] rounded-full animate-sound-wave delay-150"></div>
          </div>
        ) : (
          <span className={cn(
            'font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40',
            'group-hover:hidden'
          )}>
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <button 
          className={cn(
            'hidden group-hover:block w-5 h-5 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-[#fa2d2f] transition-colors',
            'group-hover:flex'
          )}
          aria-label="播放"
        >
          <span className="text-sm ml-0.5">▶️</span>
        </button>
      </div>

      {showAlbum && (
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-3">
          <img 
            src={song.coverImg || song.album.coverImg} 
            alt={song.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1 min-w-0 mr-4">
        <h4 className={cn(
          'font-sf-pro-text text-body truncate',
          isCurrentSong ? 'text-[#fa2d2f] font-semibold' : 'text-black dark:text-white'
        )}>
          {song.name}
        </h4>
        <p className="font-sf-pro-text text-caption-1 text-black/60 dark:text-white/60 truncate">
          {song.artists.map(artist => artist.name).join(', ')}
        </p>
      </div>

      {showAlbum && !showAlbum && (
        <div className="w-40 flex-shrink-0 hidden md:block">
          <p className="font-sf-pro-text text-body text-black/60 dark:text-white/60 truncate">
            {song.album.name}
          </p>
        </div>
      )}

      {showDuration && (
        <div className="w-16 flex-shrink-0 text-right">
          <p className="font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40">
            {formatDuration(song.duration)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          className="w-8 h-8 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-[#fa2d2f] transition-colors"
          aria-label="喜欢"
        >
          <span className="text-lg">❤️</span>
        </button>
        <button 
          className="w-8 h-8 flex items-center justify-center text-black/40 dark:text-white/40 hover:text-[#fa2d2f] transition-colors"
          aria-label="更多"
        >
          <span className="text-lg">⋯</span>
        </button>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
