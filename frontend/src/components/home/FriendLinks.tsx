'use client';

import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/theme-context';

interface FriendLink {
  id: string;
  name: string;
  url: string;
  favicon: string;
  description?: string;
}

interface FriendLinksProps {
  links: FriendLink[];
}

export default function FriendLinks({ links }: FriendLinksProps) {
  const { resolvedTheme } = useTheme();
  
  const glassCardClass = resolvedTheme === 'dark'
    ? 'glass-card'
    : 'bg-gray-100 shadow-lg border border-gray-200';
  
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 animate-fade-in-up">
          友情链接
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <GlassCard
                className={`${glassCardClass} h-full flex flex-col items-center justify-center p-6`}
                hoverEffect={true}
                glowEffect={true}
                padding="md"
              >
                {/* Favicon */}
                <img
                  src={link.favicon}
                  alt={link.name}
                  className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* 名称 */}
                <h4 className="text-foreground font-medium mb-1 group-hover:text-tech-cyan transition-colors">
                  {link.name}
                </h4>
                
                {/* 描述 */}
                {link.description && (
                  <p className="text-muted-foreground text-sm">{link.description}</p>
                )}
              </GlassCard>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}