'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Code, Zap, TrendingUp } from 'lucide-react';
import type { Feature } from '@/types';

export default function FeaturedSection() {
  const features: Feature[] = [
    {
      id: '1',
      title: '最新文章',
      description: '探索我们最新的热门文章，涵盖最新的技术趋势。',
      icon: TrendingUp,
      link: '/posts',
    },
    {
      id: '2',
      title: '技术教程',
      description: '一步步指导和教程，帮助您掌握新技术。',
      icon: Code,
      link: '/posts?category=tutorials',
    },
    {
      id: '3',
      title: '开源项目',
      description: '发现开源项目并为开发者社区做贡献。',
      icon: BookOpen,
      link: '/posts?category=opensource',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="glass-card p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            精选<span className="text-gradient">栏目</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.id} href={feature.link}>
                <Card className="glass-hover group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-tech-cyan/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-tech-cyan" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-tech-cyan transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
