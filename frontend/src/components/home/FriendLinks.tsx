'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink } from 'lucide-react';
import type { FriendLink } from '@/types';

export default function FriendLinks() {
  const links: FriendLink[] = [
    {
      id: '1',
      name: 'Next.js',
      url: 'https://nextjs.org',
      avatar: '/assets/nextjs-logo.svg',
      description: 'The React framework for production',
    },
    {
      id: '2',
      name: 'Vercel',
      url: 'https://vercel.com',
      avatar: '/assets/vercel-logo.svg',
      description: 'Develop. Preview. Ship.',
    },
    {
      id: '3',
      name: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      avatar: '/assets/tailwind-logo.svg',
      description: 'Rapidly build modern websites',
    },
    {
      id: '4',
      name: 'Radix UI',
      url: 'https://www.radix-ui.com',
      avatar: '/assets/radix-logo.svg',
      description: 'Unstyled, accessible UI primitives',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="glass-card p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Friend <span className="text-gradient">Links</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {links.map((link) => (
                  <Tooltip key={link.id}>
                    <TooltipTrigger asChild>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <Card className="glass-hover h-full flex flex-col items-center justify-center p-6">
                          <CardContent className="p-0 text-center">
                            <div className="w-12 h-12 mb-3 mx-auto bg-glass/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <ExternalLink className="w-6 h-6 text-tech-cyan" />
                            </div>

                            <h4 className="text-white font-medium mb-1 group-hover:text-tech-cyan transition-colors">
                              {link.name}
                            </h4>

                            {link.description && (
                              <p className="text-gray-400 text-sm">
                                {link.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visit {link.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
