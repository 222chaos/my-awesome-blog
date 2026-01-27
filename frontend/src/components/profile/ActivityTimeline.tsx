'use client';

import { Calendar, FileText, Award, GitCommit, Star, MessageSquare, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Activity {
  id: string;
  type: 'post' | 'achievement' | 'comment' | 'star';
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'post',
    date: '2024年1月25日',
    title: '发布了新文章',
    description: '《React Server Components 最佳实践》',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-blue-500',
  },
  {
    id: '2',
    type: 'achievement',
    date: '2024年1月23日',
    title: '获得成就',
    description: '文章累计获得 10,000 次阅读',
    icon: <Award className="w-4 h-4" />,
    color: 'text-yellow-500',
  },
  {
    id: '3',
    type: 'star',
    date: '2024年1月20日',
    title: '项目获得 Star',
    description: 'my-awesome-blog 项目突破 100 Star',
    icon: <Star className="w-4 h-4" />,
    color: 'text-purple-500',
  },
  {
    id: '4',
    type: 'comment',
    date: '2024年1月18日',
    title: '收到新评论',
    description: '用户"开发者小明"评论了你的文章',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-green-500',
  },
  {
    id: '5',
    type: 'post',
    date: '2024年1月15日',
    title: '发布了新文章',
    description: '《Next.js 14 完整教程》',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-blue-500',
  },
  {
    id: '6',
    type: 'achievement',
    date: '2024年1月10日',
    title: '获得成就',
    description: '连续写作 30 天',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-orange-500',
  },
  {
    id: '7',
    type: 'post',
    date: '2024年1月5日',
    title: '发布了新文章',
    description: '《TypeScript 高级类型解析》',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-blue-500',
  },
];

export default function ActivityTimeline() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          活动时间线
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
          查看全部
        </button>
      </div>

      <GlassCard padding="lg" className="border-border">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4 group">
                <div className={`relative flex-shrink-0 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-primary ${activity.color}`}>
                  {activity.icon}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {activity.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {activity.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                {index === 0 && (
                  <div className="absolute top-0 left-4 w-8 h-8 -translate-x-full bg-primary/10 rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <button className="w-full py-2.5 px-4 bg-muted/50 hover:bg-muted text-foreground text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
            加载更多活动
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
