'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number;
}

// 检测View Transitions API支持
const hasViewTransitionSupport = typeof document !== 'undefined' && 
  'startViewTransition' in document;

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    // 初始化时同步主题状态
    setIsDark(theme === 'dark' || (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, [theme]);
  
  useEffect(() => {
    const updateTheme = () => {
      if (typeof document !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };
    
    updateTheme();
    
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(updateTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || typeof document === 'undefined') return;
    
    // 获取当前主题状态
    const currentIsDark = document.documentElement.classList.contains('dark');
    const newTheme = currentIsDark ? 'light' : 'dark';
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    
    // 如果支持View Transitions API，使用动画切换
    if (hasViewTransitionSupport) {
      await document.startViewTransition(() => {
        setTheme(newTheme);
      }).ready;
      
      const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );
      
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    } else {
      // 不支持的浏览器，直接切换主题
      setTheme(newTheme);
      
      // 使用CSS动画作为fallback
      document.documentElement.animate(
        [
          { opacity: 0.8 },
          { opacity: 1 },
        ],
        {
          duration: 200,
          easing: 'ease-out',
        }
      );
    }
  }, [setTheme, duration]);
  
  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn('p-2 rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', className)}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">切换主题</span>
    </button>
  );
};
