'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Eye, Tag, Users } from 'lucide-react';
import type { Stat } from '@/types';

function useNumberAnimation(target: number, duration: number = 2000) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCurrent(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return current;
}

export default function StatsPanel() {
  const stats: Stat[] = [
    { label: 'Articles', value: 150, icon: FileText },
    { label: 'Views', value: 50000, icon: Eye },
    { label: 'Categories', value: 24, icon: Tag },
    { label: 'Followers', value: 3200, icon: Users },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Card className="glass-card p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const animatedValue = useNumberAnimation(stat.value);
              return (
                <Card key={stat.label} className="glass-hover group text-center">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-10 h-10 text-tech-cyan" />
                    </div>

                    <div className="text-4xl font-bold text-white mb-2">
                      {animatedValue}+
                    </div>

                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
}
