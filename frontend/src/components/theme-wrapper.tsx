'use client';

import { ThemeProvider } from '@/context/theme-context';
import { useState, useEffect } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 改进：添加过渡效果，使闪烁更平滑
  return (
    <ThemeProvider>
      <div 
        className={`transition-opacity duration-300 ${
          !isMounted ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}