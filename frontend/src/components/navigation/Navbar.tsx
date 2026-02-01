'use client';

import Link from 'next/link';
import AnimatedLogo from './AnimatedLogo';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Home, BookOpen, Briefcase, Mail, Camera, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RopeThemeToggler } from '@/components/ui/rope-theme-toggler';
import { useThemedClasses } from '@/hooks/useThemedClasses';
import UserProfileMenu from './UserProfileMenu';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme } = useThemedClasses();
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 防止 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  // 检测用户的减少动画偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // 使用防抖处理滚动事件
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 10);
      }, 10); // 10ms 防抖
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // 定义导航链接接口
  interface NavLink {
    href: `/` | `/${string}`;
    label: string;
    icon: React.ElementType;
  }

  // 将 navLinks 定义移到组件外部或使用 useMemo 缓存
  const navLinks: NavLink[] = [
    { href: '/', label: '首页', icon: Home },
    { href: '/home', label: '家', icon: Home },
    { href: '/articles', label: '文章', icon: BookOpen },
    { href: '/gallery', label: '相册', icon: Camera },
    { href: '/tools', label: '百宝箱', icon: Wrench },
    { href: '/messages', label: '留言', icon: Mail },
    { href: '/contact', label: '联系我', icon: Mail },
  ];

  return (
    <>
      <header
        role="banner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'sticky top-0 z-[100] w-full transition-all duration-300',
          reducedMotion ? 'transition-none' : '',
          scrolled || isHovered
            ? 'bg-glass backdrop-blur-3xl shadow-2xl'
            : 'bg-transparent backdrop-blur-0'
        )}
      >
        <div className="w-full h-16 flex items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <AnimatedLogo />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <nav role="navigation" aria-label="主导航">
              <div className="flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href as any}
                      className={cn(
                        'nav-link relative text-sm font-medium transition-colors flex items-center py-2 space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-tech-cyan rounded',
                        pathname === link.href
                          ? "text-tech-cyan"
                          : "text-foreground/80 hover:text-tech-cyan"
                      )}
                      aria-current={pathname === link.href ? "page" : undefined}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{link.label}</span>
                      {pathname === link.href && (
                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-tech-cyan to-tech-lightcyan" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex items-center space-x-2 text-foreground">
              <RopeThemeToggler ropeLength={120} className="hidden md:flex" />
              <RopeThemeToggler ropeLength={80} className="flex md:hidden" />
            </div>
            
            <div className="flex items-center space-x-2 text-foreground">
              <UserProfileMenu mounted={mounted} />
            </div>
          </div>
        </div>
      </header>
      </>
  );
}