'use client';

import Link from 'next/link';
import AnimatedLogo from './AnimatedLogo';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, BookOpen, Briefcase, Mail, Camera, Wrench, User, UserCircle, LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RopeThemeToggler } from '@/components/ui/rope-theme-toggler';
import { useTheme } from '@/context/theme-context';
import { useThemeUtils } from '@/hooks/useThemeUtils';
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
  const { resolvedTheme } = useTheme();
  const { getThemeClass } = useThemeUtils();
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 防止 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  // 根据主题选择下拉框样式
  const dropdownBgClass = getThemeClass(
    'bg-slate-900/95 backdrop-blur-xl border border-slate-700/50',
    'bg-white/95 backdrop-blur-xl border-gray-300'
  );
  const dropdownItemClass = getThemeClass(
    'focus:bg-tech-cyan/20 hover:bg-slate-700/30',
    'focus:bg-gray-100 hover:bg-gray-50'
  );
  const textColorClass = getThemeClass(
    'text-foreground/90 group-hover:text-tech-cyan',
    'text-gray-800 group-hover:text-tech-cyan'
  );
  const separatorClass = getThemeClass(
    'bg-slate-700/30',
    'bg-gray-200'
  );
  const dropdownShadowClass = getThemeClass(
    'shadow-xl shadow-tech-cyan/10',
    'shadow-lg shadow-gray-300/30'
  );

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
    { href: '/articles', label: '文章', icon: BookOpen },
    { href: '/gallery', label: '相册', icon: Camera },
    { href: '/tools', label: '百宝箱', icon: Wrench },
    { href: '/messages', label: '留言', icon: Mail },
    { href: '/contact', label: '联系我', icon: Mail },
  ];

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
          scrolled || isHovered
            ? 'bg-glass backdrop-blur-3xl shadow-2xl'
            : 'bg-transparent backdrop-blur-0'
        }`}
      >
        <div className="w-full h-16 flex items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <AnimatedLogo />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
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

            <div className="flex items-center space-x-2 text-foreground">
              <RopeThemeToggler ropeLength={120} className="hidden md:flex" />
              <RopeThemeToggler ropeLength={60} className="flex md:hidden" />
            </div>
            <div className="flex items-center space-x-2 text-foreground">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" size="sm" className="flex items-center justify-center text-foreground p-2 w-9 h-9 hover:bg-tech-cyan/20 transition-all duration-200 hover:scale-105">
                  <User className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`w-56 ${dropdownBgClass} ${dropdownShadowClass} z-[200]`}>
                <DropdownMenuLabel className={`text-sm font-semibold py-2 px-2 ${mounted && resolvedTheme === 'dark' ? 'text-foreground/80' : 'text-gray-900'}`}>
                  我的账户
                </DropdownMenuLabel>
                <DropdownMenuSeparator className={separatorClass} />
                <Link href="/profile">
                  <DropdownMenuItem className={`group cursor-pointer py-3 ${dropdownItemClass}`}>
                    <UserCircle className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
                    <span className={`${textColorClass} transition-colors`}>个人资料</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className={`group cursor-pointer py-3 ${dropdownItemClass}`}>
                  <LayoutDashboard className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
                  <span className={`${textColorClass} transition-colors`}>仪表板</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={`group cursor-pointer py-3 ${dropdownItemClass}`}>
                  <FileText className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
                  <span className={`${textColorClass} transition-colors`}>文章管理</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={separatorClass} />
                <DropdownMenuItem className={`group cursor-pointer py-3 ${dropdownItemClass}`}>
                  <Settings className="h-4 w-4 mr-3 text-tech-cyan group-hover:scale-110 transition-transform" />
                  <span className={`${textColorClass} transition-colors`}>设置</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={separatorClass} />
                <DropdownMenuItem className={`group cursor-pointer py-3 ${mounted && resolvedTheme === 'dark' ? 'focus:bg-red-500/20 hover:bg-red-500/30' : 'focus:bg-red-100 hover:bg-red-100'}`}>
                  <LogOut className="h-4 w-4 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className={`group-hover:text-red-600 transition-colors ${mounted && resolvedTheme === 'dark' ? 'text-foreground/90' : 'text-gray-800'}`}>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      </>
  );
}