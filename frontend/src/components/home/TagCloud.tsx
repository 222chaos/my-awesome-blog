'use client';

import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

interface Tag {
  name: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
}

// 根据标签数量计算大小
function getSizeClass(count: number, maxCount: number): string {
  const ratio = count / maxCount;
  if (ratio > 0.8) return 'text-lg px-4 py-2';
  if (ratio > 0.5) return 'text-base px-3 py-1.5';
  return 'text-sm px-2 py-1';
}

// 根据标签数量计算颜色
function getColorClass(count: number, maxCount: number): string {
  const ratio = count / maxCount;
  if (ratio > 0.8) return 'text-tech-cyan border-tech-cyan';
  if (ratio > 0.5) return 'text-muted-foreground border-glass-border';
  return 'text-muted-foreground border-glass-border';
}

export default function TagCloud({ tags }: TagCloudProps) {

  
  if (!tags || tags.length === 0) {
    return null;
  }

  // 找到最大数量以计算相对大小
  const maxCount = Math.max(...tags.map(tag => tag.count));

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 animate-fade-in-up">
          标签云
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag, index) => (
            <button
              key={tag.name}
              className={cn(
                'rounded-full border transition-all duration-300',
                'hover:scale-110 hover:shadow-lg',
                'hover:border-tech-cyan',
                getSizeClass(tag.count, maxCount),
                getColorClass(tag.count, maxCount)
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tag.name}
              <span className="ml-1 text-xs opacity-60">({tag.count})</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}