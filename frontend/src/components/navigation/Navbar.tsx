'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
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

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/posts', label: '文章' },
    { href: '/about', label: '关于' },
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
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl">⚡</span>
          <span className="hidden font-bold lg:inline-block text-xl text-gradient-primary">
            我的优秀博客
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1 ml-12">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href as any}>
              <span
                className={`nav-link transition-colors hover:text-tech-cyan text-white/80 py-2 ${
                  pathname === link.href ? 'text-tech-cyan active' : ''
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
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
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link href={link.href as any}>
                      <span
                        className={`text-lg font-medium transition-colors hover:text-tech-cyan text-white/80 block py-3 px-4 rounded-lg hover:bg-glass/30 ${
                          pathname === link.href ? 'text-tech-cyan bg-glass/30' : ''
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </SheetClose>
                ))}
                <div className="border-t border-glass-border pt-4 mt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-tech-cyan" asChild>
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      🐦 推特
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-tech-cyan" asChild>
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
