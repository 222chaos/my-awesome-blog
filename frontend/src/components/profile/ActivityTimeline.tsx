'use client';

import { Calendar, FileText, Award, GitCommit, Star, MessageSquare, Zap, ArrowRight } from 'lucide-react';
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
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    type: 'achievement',
    date: '2024年1月23日',
    title: '获得成就',
    description: '文章累计获得 10,000 次阅读',
    icon: <Award className="w-4 h-4" />,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: '3',
    type: 'star',
    date: '2024年1月20日',
    title: '项目获得 Star',
    description: 'my-awesome-blog 项目突破 100 Star',
    icon: <Star className="w-4 h-4" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: '4',
    type: 'comment',
    date: '2024年1月18日',
    title: '收到新评论',
    description: '用户"开发者小明"评论了你的文章',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: '5',
    type: 'post',
    date: '2024年1月15日',
    title: '发布了新文章',
    description: '《Next.js 14 完整教程》',
    icon: <FileText className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '6',
    type: 'achievement',
    date: '2024年1月10日',
    title: '获得成就',
    description: '连续写作 30 天',
    icon: <Zap className="w-4 h-4" />,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: '7',
    type: 'post',
    date: '2024年1月5日',
    title: '发布了新文章',
    description: '《TypeScript 高级类型解析》',
    icon: <FileText className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
  },
];

export default function ActivityTimeline() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-tech-cyan" />
          活动时间线
        </h3>
        <button className="text-sm text-tech-cyan hover:text-tech-sky transition-colors cursor-pointer flex items-center gap-1 group">
          查看全部
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <GlassCard padding="lg" className="border-tech-cyan/20">
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-tech-cyan via-tech-sky to-transparent" />
          
          {/* 顶部光晕 */}
          <div className="absolute top-0 left-4 w-8 h-8 -translate-x-full bg-tech-cyan/20 rounded-full animate-pulse-glow" />

          <div className="space-y-8">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4 group">
                {/* 图标节点 */}
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:shadow-[0_0_30px_var(--shadow-tech-cyan)] z-10`}>
                  {activity.icon}
                  
                  {/* 光晕效果 */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500`} />
                </div>

                {/* 内容卡片 */}
                <div className="flex-grow min-w-0 relative group-hover:translate-x-1 transition-transform duration-300">
                  {/* 悬停背景 */}
                  <div className="absolute inset-0 -mx-4 p-4 rounded-xl bg-tech-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-foreground group-hover:text-tech-cyan transition-colors">
                        {activity.title}
                      </span>
                      <span className="text-xs text-muted-foreground bg-tech-cyan/10 px-2 py-1 rounded-full">
                        {activity.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                      {activity.description}
                    </p>
                  </div>
                </div>

                {/* 连接线 */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-8 bg-gradient-to-b from-tech-cyan/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <button className="w-full py-3 px-4 bg-gradient-to-r from-tech-cyan/10 to-tech-sky/10 hover:from-tech-cyan/20 hover:to-tech-sky/20 text-foreground text-sm font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_var(--shadow-tech-cyan)] cursor-pointer flex items-center justify-center gap-2 group border border-tech-cyan/20">
            加载更多活动
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

