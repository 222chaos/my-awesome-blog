'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

export interface FriendLinkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  glowEffect?: boolean;
  className?: string;
  cornerAnimation?: boolean; // 是否启用角部扩展动画
}

const FriendLinkCard = React.forwardRef<HTMLDivElement, FriendLinkCardProps>(
  ({ 
    children, 
    padding = 'md', 
    hoverEffect = false, 
    glowEffect = false, 
    className, 
    cornerAnimation = false,
    ...props 
  }, ref) => {
    const { resolvedTheme } = useTheme();
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    
    // 根据主题确定玻璃效果
    // 浅色模式: 更高的不透明度以保持可读性
    // 深色模式: 可以使用较低的透明度
    const backgroundClass = resolvedTheme === 'dark' 
      ? 'bg-glass/70 backdrop-blur-xl' 
      : 'bg-glass/80 backdrop-blur-xl';
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl border border-glass-border shadow-lg text-foreground transition-all duration-300 overflow-hidden',
          backgroundClass,
          hoverEffect && 'hover:-translate-y-1 hover:shadow-2xl hover:border-glass-glow',
          glowEffect && 'hover:shadow-[0_0_30px_var(--shadow-tech-cyan)]',
          cornerAnimation && 'friend-link-corner',
          className
        )}
        {...props}
      >
        <div className={cn('z-10 pointer-events-none', paddingClasses[padding])}>
          {children}
        </div>
      </div>
    );
  }
);

FriendLinkCard.displayName = 'FriendLinkCard';

export default FriendLinkCard;