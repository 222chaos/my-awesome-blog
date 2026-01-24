'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TimelineItem } from '@/types';

function useInView(threshold = 0.2) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, inView] as const;
}

export default function Timeline() {
  const events: TimelineItem[] = [
    {
      date: 'January 2024',
      title: 'Blog Launch',
      description: 'Started my tech blog to share knowledge and experiences with the community.',
    },
    {
      date: 'December 2023',
      title: 'React Mastery',
      description: 'Completed advanced React courses and started building complex applications.',
    },
    {
      date: 'November 2023',
      title: 'Next.js Journey',
      description: 'Migrated to Next.js 14 with App Router for better performance.',
    },
    {
      date: 'October 2023',
      title: 'Open Source',
      description: 'Contributed to several open-source projects and GitHub repositories.',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="glass-card p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Journey <span className="text-gradient">Timeline</span>
          </h2>

          <div className="relative max-w-4xl mx-auto">
            {events.map((event, index) => {
              const [ref, inView] = useInView(0.2);

              return (
                <div
                  key={index}
                  ref={ref}
                  className={`flex items-start mb-12 transition-all duration-700 ${
                    inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                >
                  <div className="relative z-10 w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-tech-cyan rounded-full shadow-lg shadow-tech-cyan/50 animate-pulse"></div>
                  </div>

                  <Card className="flex-1 ml-8 glass-hover">
                    <CardContent className="p-6">
                      <div className="text-sm text-tech-cyan mb-2 font-medium">
                        {event.date}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {event.title}
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>

                  {index < events.length - 1 && (
                    <div className="absolute left-8 ml-2 w-0.5 h-full -mt-16">
                      <Separator orientation="vertical" className="h-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
}
