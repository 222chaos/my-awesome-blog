'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Tag } from '@/types';

export default function TagCloud() {
  const tags: Tag[] = [
    { name: 'React', count: 45 },
    { name: 'Next.js', count: 32 },
    { name: 'TypeScript', count: 38 },
    { name: 'Tailwind CSS', count: 28 },
    { name: 'JavaScript', count: 41 },
    { name: 'Node.js', count: 25 },
    { name: 'GraphQL', count: 18 },
    { name: 'Docker', count: 15 },
    { name: 'Git', count: 22 },
    { name: 'Testing', count: 19 },
    { name: 'API Design', count: 12 },
    { name: 'Performance', count: 14 },
  ];

  const maxCount = Math.max(...tags.map(t => t.count));

  const getSizeClass = (count: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-lg px-4 py-2';
    if (ratio > 0.5) return 'text-base px-3 py-1.5';
    return 'text-sm px-2 py-1';
  };

  const getColorClass = (count: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'bg-tech-cyan/20 text-tech-cyan border-tech-cyan/30';
    if (ratio > 0.5) return 'bg-tech-cyan/10 text-gray-200 border-glass-border';
    return 'bg-glass/30 text-gray-400 border-glass-border/50';
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="glass-card p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Popular <span className="text-gradient">Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="flex flex-wrap gap-3 justify-center">
                {tags.map((tag) => (
                  <Tooltip key={tag.name}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`rounded-full border transition-all duration-300 hover:scale-110 hover:shadow-tech-cyan/20 ${getSizeClass(tag.count)} ${getColorClass(tag.count)}`}
                      >
                        {tag.name}
                        <span className="ml-1 text-xs opacity-60">({tag.count})</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tag.count} articles tagged with {tag.name}</p>
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
