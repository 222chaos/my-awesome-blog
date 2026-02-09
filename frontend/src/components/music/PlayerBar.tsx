'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Song, PlayMode } from '@/types/music';

interface PlayerBarProps {
  currentSong?: Song;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playMode: PlayMode;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (progress: number) => void;
  onVolumeChange: (volume: number) => void;
  onModeChange: (mode: PlayMode) => void;
  onShowPlaylist?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function PlayerBar({ 
  currentSong,
  isPlaying,
  progress,
  duration,
  volume,
  playMode,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onModeChange,
  onShowPlaylist,
  isExpanded = false,
  onToggleExpand
}: PlayerBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    onSeek(newProgress);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'list':
        return '🔁';
      case 'random':
        return '🔀';
      case 'single':
        return '🔂';
      default:
        return '🔁';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-100">
      <div className={cn(
        'h-22 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-2xl border-t border-black/8 dark:border-white/8 shadow-macos-5 transition-all duration-300',
        isExpanded && 'h-100'
      )}>
        <div className="flex items-center h-full px-4">
          <div className="w-30 flex items-center gap-3 flex-shrink-0">
            {currentSong && (
              <>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                  <img 
                    src={currentSong.coverImg || currentSong.album.coverImg} 
                    alt="专辑封面"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sf-pro-text text-headline text-black dark:text-white truncate">
                    {currentSong.name}
                  </h3>
                  <p className="font-sf-pro-text text-body text-black/60 dark:text-white/60 truncate">
                    {currentSong.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="w-40 flex flex-col items-center justify-center flex-shrink-0">
            <div className="flex items-center gap-4 mb-2">
              <button 
                className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
                onClick={onModeChange}
                aria-label="切换播放模式"
              >
                <span className="text-lg">{getPlayModeIcon()}</span>
              </button>
              
              <button 
                className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-[#fa2d2f] transition-colors duration-200"
                onClick={onPrevious}
                aria-label="上一首"
              >
                <span className="text-2xl">⏮️</span>
              </button>
              
              <button 
                className={cn(
                  'w-12 h-12 bg-[#fa2d2f] rounded-full flex items-center justify-center text-white transition-all duration-200',
                  'hover:bg-[#ff3b30] hover:scale-105',
                  'active:scale-95'
                )}
                onClick={isPlaying ? onPause : onPlay}
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                <span className="text-2xl ml-0.5">{isPlaying ? '⏸️' : '▶️'}</span>
              </button>
              
              <button 
                className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-[#fa2d2f] transition-colors duration-200"
                onClick={onNext}
                aria-label="下一首"
              >
                <span className="text-2xl">⏭️</span>
              </button>
              
              <button 
                className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
                onClick={onShowPlaylist}
                aria-label="播放列表"
              >
                <span className="text-lg">📋</span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full px-2">
              <span className="font-sf-pro-text text-caption-1 text-black/60 dark:text-white/60 w-10 text-right flex-shrink-0">
                {formatTime(progress)}
              </span>
              
              <div className="flex-1 relative h-1 group">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={progress}
                  onChange={handleSeek}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  className={cn(
                    'absolute inset-0 w-full h-full appearance-none cursor-pointer',
                    'bg-transparent'
                  )}
                  style={{
                    WebkitAppearance: 'none',
                    background: 'transparent'
                  }}
                />
                <div className="absolute inset-0 h-1 bg-black/20 dark:bg-white/20 rounded-full pointer-events-none">
                  <div 
                    className="absolute left-0 top-0 h-1 bg-[#fa2d2f] rounded-full pointer-events-none"
                    style={{ 
                      width: `${(progress / duration) * 100}%`,
                      boxShadow: '0 0 8px rgba(250, 45, 47, 0.5)'
                    }}
                  >
                    <div 
                      className={cn(
                        'absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm pointer-events-none transition-all duration-200',
                        'group-hover:scale-120',
                        isDragging && 'scale-120'
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <span className="font-sf-pro-text text-caption-1 text-black/60 dark:text-white/60 w-10 flex-shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="w-30 flex items-center justify-end gap-2 flex-shrink-0">
            <button 
              className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
              aria-label="音量"
            >
              <span className="text-lg">🔊</span>
            </button>
            
            <div className="w-24 relative h-1 group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                onMouseDown={() => setIsVolumeDragging(true)}
                onMouseUp={() => setIsVolumeDragging(false)}
                className={cn(
                  'absolute inset-0 w-full h-full appearance-none cursor-pointer',
                  'bg-transparent'
                )}
                style={{
                  WebkitAppearance: 'none',
                  background: 'transparent'
                }}
              />
              <div className="absolute inset-0 h-1 bg-black/20 dark:bg-white/20 rounded-full pointer-events-none">
                <div 
                  className="absolute left-0 top-0 h-1 bg-white/80 dark:bg-white/80 rounded-full pointer-events-none"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>

            <button 
              className="w-8 h-8 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200"
              onClick={onToggleExpand}
              aria-label={isExpanded ? '收起播放器' : '展开播放器'}
            >
              <span className={cn('text-lg transition-transform duration-200', isExpanded && 'rotate-180')}>
                ▲
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
