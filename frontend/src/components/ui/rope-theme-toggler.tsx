'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

interface RopeThemeTogglerProps extends React.ComponentPropsWithoutRef<'div'> {
  ropeLength?: number;
  ropeColor?: string;
  ropeWidth?: number;
  animationDuration?: number;
}

// 检测View Transitions API支持
const hasViewTransitionSupport = typeof document !== 'undefined' && 
  'startViewTransition' in document;

export const RopeThemeToggler = ({
  ropeLength = 120,
  ropeColor = 'from-amber-800 to-amber-700',
  ropeWidth = 4,
  animationDuration = 400,
  className,
  ...props
}: RopeThemeTogglerProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isPulling, setIsPulling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 直接使用resolvedTheme，它已经处理了auto模式
  const isDark = resolvedTheme === 'dark';

  // 移除MutationObserver，直接使用resolvedTheme

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || typeof document === 'undefined') return;

    // 触发绳子拉动动画
    setIsPulling(true);
    
    // 获取当前主题状态
    const currentIsDark = document.documentElement.classList.contains('dark');
    const newTheme = currentIsDark ? 'light' : 'dark';

    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }

    // 在动画结束后切换主题
    setTimeout(async () => {
      // 如果支持View Transitions API，使用动画切换
      if (hasViewTransitionSupport) {
        await document.startViewTransition(() => {
          setTheme(newTheme);
        }).ready;

        if (buttonRef.current) {
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
              duration: animationDuration,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        }
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

      // 动画完成后重置拉动状态
      setTimeout(() => {
        setIsPulling(false);
      }, 300);
    }, 150); // 等待下拉动画的一半时间后切换主题
  }, [setTheme, animationDuration]);

  return (
    <div
      ref={containerRef}
      className={cn("rope-container relative flex flex-col items-start", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* 摇摆容器wrapper - 用于hover增强 */}
      <div className="rope-swing-wrapper">
        {/* 摇摆容器 - 包含绳子和按钮 */}
        <div
          className={cn(
            "swing-container relative flex flex-col items-center",
            isPulling ? "rope-pull" : "rope-swing"
          )}
          style={{
            transformOrigin: 'top center'
          } as React.CSSProperties}
        >
        {/* 固定点装饰 - 连接到导航栏底部 */}
        <div className="w-2 h-2 rounded-full bg-gradient-to-b from-amber-700 to-amber-600 mb-1 z-10"></div>
        
        {/* 绳子 */}
        <div 
          className={cn(
            "rope-line w-[var(--rope-width)] relative overflow-hidden transition-all duration-300 ease-out",
            "bg-gradient-to-b", 
            ropeColor,
            "rounded-full"
          )}
          style={{ 
            height: `${ropeLength}px`,
            '--rope-length': `${ropeLength}px`,
            '--rope-width': `${ropeWidth}px`
          } as React.CSSProperties}
        >
          {/* 绳子纹理效果 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.2)_20%,transparent_40%,rgba(0,0,0,0.2)_60%,transparent_100%)]"></div>
        </div>
        
        {/* 绳结装饰 */}
        <div className="w-3 h-1.5 bg-gradient-to-b from-amber-700/90 to-amber-600/90 rounded-full -mt-0.5 z-10"></div>
        
        {/* 主题切换按钮 */}
        <button
          ref={buttonRef}
          onClick={toggleTheme}
          className={cn(
            'relative w-9 h-9 flex items-center justify-center rounded-full bg-glass/50 backdrop-blur-xl border border-glass-border',
            'hover:bg-glass/70 hover:border-glass-border/50 hover:shadow-lg hover:scale-110',
            'transition-all duration-300 ease-in-out cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-amber-600/50',
            'z-10'
          )}
          aria-label="切换主题"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-white transition-transform duration-500 animate-spin-slow" />
          ) : (
            <Moon className="h-5 w-5 text-white transition-transform duration-500" />
          )}
          
          {/* 按钮发光效果 */}
          <div className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-700/10",
            "transition-opacity duration-300",
            "pointer-events-none"
          )}></div>
        </button>
        </div>
      </div>
    </div>
  );
};