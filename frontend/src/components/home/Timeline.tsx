'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/context/theme-context';

// 注册ScrollTrigger插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

// 单个事件项的包装组件
function TimelineEventItem({ event, index }: { event: TimelineEvent; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const isLeft = index % 2 === 0;

  useEffect(() => {
    const item = itemRef.current;
    const dot = dotRef.current;
    const card = cardRef.current;
    const line = lineRef.current;

    if (!item || !dot || !card || typeof window === 'undefined') return;

    // 创建时间轴来协调多个动画
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        end: 'top 15%',
        scrub: 1,
        // markers: true, // 开启此行可显示调试标记
      }
    });

    // 为时间轴点设置缩放和脉冲动画
    tl.fromTo(dot,
      { scale: 0, opacity: 0, boxShadow: '0 0 0px var(--tech-cyan)' },
      {
        scale: 1,
        opacity: 1,
        boxShadow: '0 0 20px var(--tech-cyan)',
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      },
      0
    );

    // 为连接线段设置动画（仅对非第一个元素）
    if (line && index > 0) {
      tl.fromTo(line,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          transformOrigin: 'top',
          ease: 'power2.inOut'
        },
        0
      );
    }

    // 为卡片设置更丰富的视差滚动效果
    tl.fromTo(card,
      {
        x: isLeft ? -80 : 80,
        opacity: 0,
        y: 30,
        rotateY: isLeft ? -30 : 30,
        scale: 0.9
      },
      {
        x: 0,
        opacity: 1,
        y: 0,
        rotateY: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      },
      '<0.2' // 与前一个动画重叠0.2秒开始
    );

    // 为卡片内部元素添加延迟动画
    const titleElement = card.querySelector('h4');
    const descElement = card.querySelector('p');
    const dateElement = card.querySelector('.text-sm');

    if (titleElement) {
      tl.fromTo(titleElement,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        },
        '<0.3' // 在上面动画基础上再延迟0.3秒
      );
    }

    if (descElement) {
      tl.fromTo(descElement,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        },
        '<0.1' // 紧随标题之后
      );
    }

    if (dateElement) {
      tl.fromTo(dateElement,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        },
        '<0.4' // 在标题之前
      );
    }

    // 为整个项目添加轻微的浮动效果
    tl.fromTo(item,
      { y: 0 },
      {
        y: 8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      },
      0
    ).pause(); // 暂停自动播放，仅在滚动时激活

    // 返回清理函数
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLeft, index]);

  return (
    <div
      ref={itemRef}
      className={`relative flex items-start mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* 连接线段 - 只对非第一个元素显示 */}
      {index > 0 && (
        <div
          ref={lineRef}
          className="absolute left-8 top-[-60px] h-[60px] w-0.5 origin-top"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--tech-cyan))'
          }}
        ></div>
      )}

      {/* 日期点 */}
      <div className="relative z-20 w-16 h-16 flex items-center justify-center">
        <div
          ref={dotRef}
          className="w-5 h-5 bg-tech-cyan rounded-full"
          style={{
            backgroundColor: 'var(--tech-cyan)',
            boxShadow: '0 0 15px var(--tech-cyan)',
            filter: 'blur(0.5px)'
          }}
        ></div>
      </div>

      {/* 事件卡片 */}
      <GlassCard
        ref={cardRef}
        className="flex-1 ml-4 relative z-10"
        hoverEffect={true}
        padding="md"
      >
        <div className="text-sm text-tech-cyan mb-2 transition-all duration-300 group-hover:text-tech-lightcyan">{event.date}</div>
        <h4 className="text-lg font-bold text-foreground mb-2 transition-all duration-300">{event.title}</h4>
        <p className="text-muted-foreground transition-all duration-300">{event.description}</p>
      </GlassCard>
    </div>
  );
}

export default function Timeline({ events }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const verticalLine = verticalLineRef.current;

    if (!timeline || !verticalLine || typeof window === 'undefined') return;

    // 为整个时间轴添加进入动画
    gsap.fromTo(timeline,
      { y: 60, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 85%',
          end: 'bottom 10%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // 为垂直主轴线设置动画
    gsap.fromTo(verticalLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top',
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.5
        }
      }
    );

    // 返回清理函数
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-foreground">
          我的历程
        </h2>

        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* 垂直线 - 主轴 */}
          <div
            ref={verticalLineRef}
            className="absolute left-8 top-0 bottom-0 w-0.5 origin-top"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, var(--tech-cyan) 10%, var(--tech-cyan) 90%, transparent 100%)',
              filter: 'blur(0.5px)'
            }}
          ></div>

          {/* 添加装饰性光效元素 */}
          <div className="absolute left-8 top-0 h-full w-40 -ml-20 bg-gradient-to-r from-transparent via-tech-cyan/10 to-transparent opacity-30 pointer-events-none"></div>

          {events.map((event, index) => (
            <TimelineEventItem key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}