'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题提供者组件，用于在整个应用中管理主题状态
 *
 * @param {ReactNode} children - 子组件
 * @param {Theme} defaultTheme - 默认主题，默认为 'auto'
 * @param {string} storageKey - 本地存储键名，默认为 'theme'
 */
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
  const [theme, setTheme] = useState<Theme>(() => {
    // 服务端渲染时返回默认值
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    // 客户端尝试从本地存储获取主题
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (stored as Theme) : defaultTheme;
    } catch (e) {
      console.warn('无法从localStorage获取主题:', e);
      return defaultTheme;
    }
  });

  // 客户端挂载后初始化主题
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const savedTheme = stored as Theme;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          return savedTheme;
        }
      }

      // 如果是自动模式或无效值，根据系统偏好决定
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      console.warn('无法确定初始主题:', e);
      return 'dark';
    }
  });

  // 强制更新主题的方法
  const updateTheme = (newTheme: Theme) => {
    try {
      setTheme(newTheme);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme);
      }
    } catch (e) {
      console.error('无法更新主题:', e);
    }
  };

  // 计算实际主题
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') {
      return;
    }

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
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.error('无法保存主题到localStorage:', e);
    }
  }, [theme, storageKey, isMounted]);

  // 监听系统主题变化
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let timeoutId: NodeJS.Timeout;

    const handleChange = () => {
      // 使用防抖来避免频繁更新
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (theme === 'auto') {
          const newTheme = mediaQuery.matches ? 'dark' : 'light';

          // 更新DOM类
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(newTheme);

          setResolvedTheme(newTheme);
        }
      }, 50); // 50ms 防抖
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(timeoutId);
    };
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

/**
 * 自定义Hook，用于访问主题上下文
 *
 * @returns {ThemeContextType} 主题上下文值
 * @throws {Error} 如果不在ThemeProvider内调用则抛出错误
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};