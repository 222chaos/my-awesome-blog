'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  glowEffect?: boolean;
  className?: string;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, padding = 'md', hoverEffect = false, glowEffect = false, className, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    
    // 根据主题确定玻璃效果类
    const glassClass = resolvedTheme === 'light' 
      ? 'bg-glass-light border-glass-light-border text-tech-deepblue'
      : 'bg-glass border-glass-border text-tech-lightcyan';
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl backdrop-blur-xl shadow-lg',
          glassClass,
          paddingClasses[padding],
          hoverEffect && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl',
          glowEffect && 'hover:border-glass-glow',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;