'use client';

import { useState, useEffect, useRef } from 'react';
import GlassCard from '@/components/ui/GlassCard';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

// 自定义Hook - 实现滚动触发动画
function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
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

export default function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in-up">
          我的历程
        </h2>
        
        <div className="relative max-w-3xl mx-auto">
          {/* 垂直线 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-tech-cyan to-transparent"></div>
          
          {events.map((event, index) => {
            const [ref, inView] = useInView(0.2);
            const isLeft = index % 2 === 0;
            
            return (
              <TimelineItem
                key={index}
                ref={ref}
                event={event}
                isLeft={isLeft}
                inView={inView}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ event, isLeft, inView, ref }: {
  event: TimelineEvent;
  isLeft: boolean;
  inView: boolean;
  ref: (node: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={ref}
      className={`flex items-start mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* 日期 */}
      <div className="relative z-10 w-16 h-16 flex items-center justify-center">
        <div className="w-4 h-4 bg-tech-cyan rounded-full shadow-lg shadow-tech-cyan/50 animate-pulse"></div>
      </div>
      
      {/* 事件卡片 */}
      <GlassCard
        className={`flex-1 ml-4 ${
          inView 
            ? 'opacity-100 translate-x-0' 
            : isLeft 
              ? 'opacity-0 -translate-x-10' 
              : 'opacity-0 translate-x-10'
        } transition-all duration-700`}
        hoverEffect={true}
        padding="md"
      >
        <div className="text-sm text-tech-cyan mb-2">{event.date}</div>
        <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
        <p className="text-gray-300">{event.description}</p>
      </GlassCard>
    </div>
  );
}