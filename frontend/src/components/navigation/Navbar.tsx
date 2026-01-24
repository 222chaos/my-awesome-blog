'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-glass/30 backdrop-blur-lg border-b border-glass-border">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold lg:inline-block text-xl text-white">My Awesome Blog</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/" 
            className={`transition-colors hover:text-tech-cyan ${
              pathname === '/' ? 'text-tech-cyan' : 'text-white/80'
            }`}
          >
            Home
          </Link>
          <Link
            href="/posts" 
            className={`transition-colors hover:text-tech-cyan ${
              pathname === '/posts' ? 'text-tech-cyan' : 'text-white/80'
            }`}
          >
            Articles
          </Link>
          <Link
            href="/about" 
            className={`transition-colors hover:text-tech-cyan ${
              pathname === '/about' ? 'text-tech-cyan' : 'text-white/80'
            }`}
          >
            About
          </Link>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="glass" size="sm" asChild>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                Twitter
              </Link>
            </Button>
            <Button variant="glass" size="sm" asChild>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}