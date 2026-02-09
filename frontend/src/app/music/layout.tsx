'use client';

import './globals.css';
import type { ReactNode } from 'react';

export default function MusicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-macos-light-background dark:bg-macos-dark-background transition-colors duration-300">
      {children}
    </div>
  );
}
