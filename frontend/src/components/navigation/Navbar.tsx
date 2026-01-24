'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Home, BookOpen, User, Briefcase, Mail, Coffee, Camera, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 定义导航链接，包括图标
  const navLinks = [
    { href: '/', label: '首页', icon: Home },
    { href: '/home', label: '家', icon: Home },
    { href: '/travel', label: '游记', icon: Briefcase },
    { href: '/essays', label: '随笔', icon: BookOpen },
    { href: '/records', label: '记录', icon: BookOpen },
    { href: '/gallery', label: '相册', icon: Camera },
    { href: '/tools', label: '百宝箱', icon: Wrench },
    { href: '/messages', label: '留言', icon: Mail },
    { href: '/contact', label: '联系我', icon: Mail },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-glass/90 backdrop-blur-xl border-b border-glass-border/50 shadow-lg glass-glow'
          : 'bg-glass/30 backdrop-blur-lg border-b border-glass-border/30'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">⚡</span>
          <span className="font-bold text-xl text-gradient-primary hidden sm:inline-block">
            我的优秀博客
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium flex-1 ml-12">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link key={link.href} href={link.href as any}>
                <span
                  className={`nav-link relative text-sm font-medium transition-colors flex flex-col items-center py-2 ${
                    pathname === link.href
                      ? "text-tech-cyan"
                      : "text-foreground/80 hover:text-tech-cyan"
                  }`}
                >
                  <IconComponent className="h-4 w-4 mb-1" />
                  <span>{link.label}</span>
                  {pathname === link.href && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-tech-cyan to-tech-lightcyan" />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2">
          <AnimatedThemeToggler />
          <Button
            variant="glass"
            size="sm"
            asChild
            className="hidden sm:flex"
          >
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="访问Twitter"
            >
              推特
            </Link>
          </Button>
          <Button
            variant="glass"
            size="sm"
            asChild
            className="hidden sm:flex"
          >
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="访问GitHub"
            >
              GitHub
            </Link>
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="glass"
                size="sm"
                aria-label="打开菜单"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-glass/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="text-white">导航</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <SheetClose key={link.href} asChild>
                      <Link href={link.href as any}>
                        <span
                          className={`text-lg font-medium transition-colors hover:text-tech-cyan text-foreground/80 block py-3 px-4 rounded-lg hover:bg-glass/30 flex items-center space-x-3 ${
                            pathname === link.href ? 'text-tech-cyan bg-glass/30' : ''
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{link.label}</span>
                        </span>
                      </Link>
                    </SheetClose>
                  );
                })}
                <div className="border-t border-glass-border pt-4 mt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-tech-cyan" asChild>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      🐦 推特
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-foreground/80 hover:text-tech-cyan" asChild>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                      💻 GitHub
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
