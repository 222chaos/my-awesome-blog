'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, BookOpen, Briefcase, Mail, Camera, Wrench, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RopeThemeToggler } from '@/components/ui/rope-theme-toggler';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
    <>
      <header
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(15,23,42,0.5)] backdrop-blur-xl border-b border-glass-border/40 shadow-lg glass-glow'
            : 'bg-transparent backdrop-blur-0'
        }`}
      >
        <div className="w-full h-16 flex items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">⚡</span>
            <span className="font-bold text-xl text-gradient-primary hidden sm:inline-block">
              我的优秀博客
            </span>
          </Link>

          <div className="flex-1"></div>
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link key={link.href} href={link.href as any}>
                  <span
                    className={`nav-link relative text-sm font-medium transition-colors flex items-center py-2 space-x-1 ${
                      pathname === link.href
                        ? "text-tech-cyan"
                        : "text-foreground/80 hover:text-tech-cyan"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{link.label}</span>
                    {pathname === link.href && (
                      <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-tech-cyan to-tech-lightcyan" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2 ml-4">
            <RopeThemeToggler ropeLength={120} className="hidden md:flex" />
            <RopeThemeToggler ropeLength={60} className="flex md:hidden" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" size="sm" className="flex items-center">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>个人资料</DropdownMenuItem>
                <DropdownMenuItem>仪表板</DropdownMenuItem>
                <DropdownMenuItem>文章管理</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>设置</DropdownMenuItem>
                <DropdownMenuItem>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      </>
  );
}
