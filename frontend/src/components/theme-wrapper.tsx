'use client';

import { ThemeProvider } from '@/context/theme-context';
import { useState, useEffect } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ThemeProvider>
      {/* 在客户端挂载之前隐藏内容以避免闪烁 */}
      <div className={!isMounted ? 'opacity-0' : 'opacity-100'}>
        {children}
      </div>
    </ThemeProvider>
  );
}