'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'auto',
  storageKey = 'theme'
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // 客户端挂载后初始化主题
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setTheme(stored as Theme);
    }
  }, [storageKey]);

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // 强制更新主题的方法
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  // 计算实际主题
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const root = window.document.documentElement;

    // 移除旧的主题类
    root.classList.remove('light', 'dark');

    let actualTheme: 'light' | 'dark';

    if (theme === 'auto') {
      // 如果是自动模式，根据系统偏好决定
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      actualTheme = theme;
    }

    // 添加对应的主题类
    root.classList.add(actualTheme);
    setResolvedTheme(actualTheme);

    // 保存到localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey, isMounted]);

  // 监听系统主题变化
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'auto') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);

        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isMounted]);

  const value = {
    theme,
    setTheme: updateTheme, // 使用更新的主题设置方法
    resolvedTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};