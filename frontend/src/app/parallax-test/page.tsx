'use client';

import Timeline from '@/components/home/Timeline';
import { useState } from 'react';

export default function ParallaxTestPage() {
  const [timelineEvents] = useState([
    {
      date: '2024年1月',
      title: '博客启动',
      description: '开始了我的技术博客，分享知识和经验。',
    },
    {
      date: '2023年12月',
      title: 'React精通',
      description: '完成了高级React课程，开始构建复杂应用。',
    },
    {
      date: '2023年11月',
      title: 'Next.js之旅',
      description: '迁移到Next.js 14，使用App Router提升性能。',
    },
    {
      date: '2023年10月',
      title: '开源贡献',
      description: '为几个开源项目和GitHub仓库做出贡献。',
    },
    {
      date: '2023年9月',
      title: 'TypeScript掌握',
      description: '深入学习TypeScript，提高代码质量和可维护性。',
    },
    {
      date: '2023年8月',
      title: 'UI/UX设计',
      description: '学习用户体验设计原则，提升产品可用性。',
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-cyan-400">视差滚动效果测试</h1>
        
        <div className="h-screen flex items-center justify-center">
          <p className="text-xl text-center text-gray-300">向下滚动查看视差效果</p>
        </div>
        
        <Timeline events={timelineEvents} />
        
        <div className="h-screen flex items-center justify-center">
          <p className="text-xl text-center text-gray-300">向上滚动查看反向效果</p>
        </div>
      </div>
    </div>
  );
}