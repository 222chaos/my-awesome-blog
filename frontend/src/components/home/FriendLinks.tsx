'use client';

import Link from 'next/link';
import FriendLinkCard from '@/components/ui/FriendLinkCard';
import { useTheme } from '@/context/theme-context';
import { useState, useEffect } from 'react';

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
  const [mounted, setMounted] = useState(false);

  // 防止 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  const glassCardClass = mounted && resolvedTheme === 'dark'
    ? 'glass-card'
    : 'bg-gray-100 shadow-lg border border-gray-200';
  
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className="py-6 lg:py-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 animate-fade-in-up">
        友情链接
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {links.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <FriendLinkCard
                className="flex flex-row items-center justify-start px-4"
                hoverEffect={true}
                glowEffect={true}
                padding="sm"
                cornerAnimation={true}
              >
                {/* Favicon */}
                <img
                  src={link.favicon}
                  alt={link.name}
                  className="w-10 h-10 mr-3 group-hover:scale-110 transition-transform duration-300"
                />

                {/* 名称 */}
                <div className="flex-1">
                  <h4 className="text-foreground font-medium mb-1 group-hover:text-tech-cyan transition-colors">
                    {link.name}
                  </h4>

                  {/* 描述 */}
                  {link.description && (
                    <p className="text-muted-foreground text-xs">{link.description}</p>
                  )}
                </div>
              </FriendLinkCard>
            </a>
          ))}
        </div>
    </section>
  );
}