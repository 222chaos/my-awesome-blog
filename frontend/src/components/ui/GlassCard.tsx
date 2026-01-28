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
    
    // 使用 CSS 变量替代条件 className，避免 hydration 不匹配
    // 透明度由 --glass-default CSS 变量根据主题自动控制
    const backgroundClass = 'bg-glass backdrop-blur-xl';
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-glass-border shadow-lg text-foreground transition-all duration-300',
          backgroundClass,
          paddingClasses[padding],
          hoverEffect && 'hover:-translate-y-1 hover:shadow-2xl hover:border-glass-glow',
          glowEffect && 'hover:shadow-[0_0_30px_var(--shadow-tech-cyan)]',
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