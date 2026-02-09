'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import type { Playlist } from '@/types/music';

interface MusicSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  playlists: Playlist[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function MusicSidebar({ activeSection, onSectionChange, playlists, isCollapsed = false, onToggleCollapse }: MusicSidebarProps) {
  const { resolvedTheme } = useTheme();

  const navItems = [
    { id: 'discover', icon: '🎵', label: '发现音乐' },
    { id: 'fm', icon: '🎧', label: '私人FM' },
    { id: 'video', icon: '📺', label: '视频' },
    { id: 'radio', icon: '🎤', label: '电台' },
  ];

  const myMusicItems = [
    { id: 'liked', icon: '❤️', label: '我喜欢的音乐' },
    { id: 'local', icon: '💿', label: '本地音乐' },
    { id: 'download', icon: '⬇️', label: '下载管理' },
  ];

  return (
    <aside className={cn(
      'hidden md:flex flex-col h-screen flex-shrink-0 transition-all duration-300',
      'bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl',
      'border-r border-black/8 dark:border-white/8',
      'shadow-macos-glass-2',
      isCollapsed ? 'w-16' : 'w-65'
    )}>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <button
          onClick={onToggleCollapse}
          className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 mb-2"
          aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <span className="text-2xl">{isCollapsed ? '▶️' : '◀️'}</span>
        </button>

        {!isCollapsed && (
          <>
            <div className="mb-6">
              <h3 className="font-sf-pro-text text-subhead text-black/40 dark:text-white/40 mb-2 px-3">发现</h3>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200',
                      'w-full text-left',
                      activeSection === item.id ? 'bg-[#fa2d2f]/10 text-[#fa2d2f]' : 'hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white'
                    )}
                  >
                    <span className="text-xl w-5 h-5 flex items-center justify-center">{item.icon}</span>
                    <span className="font-sf-pro-text text-body">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mb-6">
              <h3 className="font-sf-pro-text text-subhead text-black/40 dark:text-white/40 mb-2 px-3">我的音乐</h3>
              <nav className="flex flex-col gap-2">
                {myMusicItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200',
                      'w-full text-left',
                      activeSection === item.id ? 'bg-[#fa2d2f]/10 text-[#fa2d2f]' : 'hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white'
                    )}
                  >
                    <span className="text-xl w-5 h-5 flex items-center justify-center">{item.icon}</span>
                    <span className="font-sf-pro-text text-body">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-sf-pro-text text-subhead text-black/40 dark:text-white/40 mb-2 px-3">创建的歌单</h3>
              <nav className="flex flex-col gap-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => onSectionChange(playlist.id)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200',
                      'w-full text-left',
                      activeSection === playlist.id ? 'bg-[#fa2d2f]/10 text-[#fa2d2f]' : 'hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white'
                    )}
                  >
                    <span className="text-lg w-5 h-5 flex items-center justify-center">📝</span>
                    <span className="font-sf-pro-text text-body truncate">{playlist.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}

        {isCollapsed && (
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-12 h-12 flex items-center justify-center rounded-xl transition-colors duration-200',
                  activeSection === item.id ? 'bg-[#fa2d2f]/10 text-[#fa2d2f]' : 'hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white'
                )}
                title={item.label}
              >
                <span className="text-xl">{item.icon}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
}
