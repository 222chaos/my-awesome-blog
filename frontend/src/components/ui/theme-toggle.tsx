'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

import { Button } from '@/components/ui/Button';

// 为了向后兼容，保留原来的ThemeToggle组件名称
// 但在内部使用动画效果
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="切换主题"
      className="relative overflow-hidden group"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Sun 
          className={`h-5 w-5 transition-all duration-500 ease-in-out ${
            theme === 'dark' 
              ? 'rotate-[-120deg] scale-50 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Moon 
          className={`h-5 w-5 transition-all duration-500 ease-in-out ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-[120deg] scale-50 opacity-0'
          }`} 
        />
      </div>
      
      {/* 环绕动画元素 */}
      <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-tech-cyan/20 transition-colors duration-300 pointer-events-none">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-tech-cyan/0 via-tech-cyan/10 to-tech-cyan/0' 
            : 'from-tech-sky/0 via-tech-sky/10 to-tech-sky/0'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin-slow`}></div>
      </div>
    </Button>
  );
}