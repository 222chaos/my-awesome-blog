'use client';

import { cn } from '@/lib/utils';
import SongRow from './SongRow';
import type { Song } from '@/types/music';

interface SongListProps {
  songs: Song[];
  showHeader?: boolean;
  showAlbum?: boolean;
  showDuration?: boolean;
  currentSong?: Song;
  isPlaying?: boolean;
  onSongClick?: (song: Song) => void;
  onSongDoubleClick?: (song: Song) => void;
}

export default function SongList({ 
  songs, 
  showHeader = true,
  showAlbum = false,
  showDuration = true,
  currentSong,
  isPlaying = false,
  onSongClick,
  onSongDoubleClick
}: SongListProps) {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex items-center h-10 px-4 border-b border-black/8 dark:border-white/8">
          <div className="w-8 flex-shrink-0">
            <span className="font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40">
              #
            </span>
          </div>
          {showAlbum && (
            <div className="w-12 h-12 flex-shrink-0 mr-3">
              <span className="font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40">
                专辑
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0 mr-4">
            <span className="font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40">
              歌曲标题
            </span>
          </div>
          {showAlbum && !showAlbum && (
            <div className="w-40 flex-shrink-0 hidden md:block">
              <span className="font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40">
                专辑
              </span>
            </div>
          )}
          {showDuration && (
            <div className="w-16 flex-shrink-0 text-right">
              <span className="font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40">
                时长
              </span>
            </div>
          )}
          <div className="w-20 flex-shrink-0">
            <span className="font-sf-pro-text text-caption-1 text-black/40 dark:text-white/40">
              操作
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {songs.map((song, index) => (
          <SongRow
            key={song.id}
            song={song}
            index={index}
            isPlaying={isPlaying && currentSong?.id === song.id}
            currentSong={currentSong}
            showAlbum={showAlbum}
            showDuration={showDuration}
            onSongClick={onSongClick}
            onSongDoubleClick={onSongDoubleClick}
          />
        ))}
      </div>

      {songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-6xl mb-4">🎵</span>
          <p className="font-sf-pro-text text-body text-black/60 dark:text-white/60">
            暂无歌曲
          </p>
        </div>
      )}
    </div>
  );
}
