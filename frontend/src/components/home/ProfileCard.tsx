'use client';

import { FileText, Eye, Users } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
}

export default function ProfileCard() {
  const stats: Stat[] = [
    { label: '文章', value: 105, icon: FileText },
    { label: '访问量', value: 251383, icon: Eye },
    { label: '友站', value: 12, icon: Users },
  ];

  return (
    <GlassCard className="rounded-2xl p-6 sm:p-8 transition-all duration-300" aria-label="个人信息卡片">
      {/* 圆形头像 */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="relative group">
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-tech-cyan to-tech-lightcyan flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="查看头像"
          >
            <Users className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" aria-label="在线状态"></div>
        </div>
      </div>

      {/* 网站名称 */}
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 text-foreground">
        POETIZE
      </h3>
      <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm">
        分享技术与生活，记录成长点滴
      </p>

      {/* 统计数据 - 同一行显示 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4" role="list" aria-label="统计数据">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg hover:bg-tech-cyan/10 transition-colors"
            role="listitem"
          >
            {/* 图标 */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-tech-cyan/20 flex items-center justify-center mb-2" aria-hidden="true">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-tech-cyan" />
            </div>
            {/* 数量 */}
            <span className="text-tech-cyan font-bold text-lg sm:text-xl mb-1">
              {stat.value.toLocaleString()}
            </span>
            {/* 标签 */}
            <span className="text-foreground font-medium text-xs sm:text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}