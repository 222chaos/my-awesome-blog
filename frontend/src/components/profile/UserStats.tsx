'use client';

import { FileText, Eye, Heart, MessageSquare, TrendingUp, Award, Calendar } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ icon, label, value, trend, trendUp }: StatCardProps) => (
  <GlassCard padding="md" className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
          {value}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          <TrendingUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </GlassCard>
);

export default function UserStats() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Award className="w-4 h-4 text-primary" />
        数据概览
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="w-4 h-4 text-primary" />}
          label="文章总数"
          value="42"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          icon={<Eye className="w-4 h-4 text-blue-500" />}
          label="总阅读量"
          value="15.8K"
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          icon={<Heart className="w-4 h-4 text-red-500" />}
          label="获赞总数"
          value="2,341"
          trend="+15%"
          trendUp={true}
        />
        <StatCard
          icon={<MessageSquare className="w-4 h-4 text-green-500" />}
          label="评论总数"
          value="486"
          trend="-3%"
          trendUp={false}
        />
      </div>

      <GlassCard padding="lg" className="border-border mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            近期活动趋势
          </h4>
          <span className="text-xs text-muted-foreground">最近 7 天</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {[65, 45, 80, 55, 90, 70, 85].map((height, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div
                className="w-full bg-primary/20 rounded-t-sm transition-all duration-300 group-hover:bg-primary/40 relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-t-sm" />
              </div>
              <span className="text-xs text-muted-foreground">
                {['一', '二', '三', '四', '五', '六', '日'][index]}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
