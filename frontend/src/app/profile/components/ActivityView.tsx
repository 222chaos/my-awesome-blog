'use client';

import { useState } from 'react';
import { FileText, MessageCircle, Heart, Eye, Filter, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

interface Activity {
  id: string;
  type: 'article' | 'comment' | 'like' | 'view';
  title: string;
  description: string;
  date: string;
  metadata?: Record<string, any>;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'article',
    title: '发布新文章',
    description: '发布了"深入理解React Hooks的工作原理"',
    date: '2025-01-25 10:30',
    metadata: { views: 128, likes: 32, comments: 8 }
  },
  {
    id: '2',
    type: 'comment',
    title: '发表评论',
    description: '评论了"TypeScript高级类型系统指南"',
    date: '2025-01-24 15:45',
    metadata: { replies: 2 }
  },
  {
    id: '3',
    type: 'like',
    title: '点赞文章',
    description: '点赞了"Next.js 15新特性详解"',
    date: '2025-01-23 09:20'
  },
  {
    id: '4',
    type: 'article',
    title: '更新文章',
    description: '更新了"Vue 3组合式API最佳实践"',
    date: '2025-01-22 14:10',
    metadata: { views: 256, likes: 45, comments: 12 }
  },
  {
    id: '5',
    type: 'view',
    title: '文章被浏览',
    description: '"深入理解React Hooks的工作原理"获得100+浏览',
    date: '2025-01-21 18:00',
    metadata: { views: 100 }
  },
  {
    id: '6',
    type: 'comment',
    title: '回复评论',
    description: '回复了用户对"CSS Grid布局完全指南"的评论',
    date: '2025-01-20 11:30'
  }
];

const activityIcons = {
  article: { icon: FileText, color: 'tech-cyan', bgColor: 'bg-tech-cyan/20' },
  comment: { icon: MessageCircle, color: 'tech-cyan', bgColor: 'bg-tech-cyan/20' },
  like: { icon: Heart, color: 'tech-cyan', bgColor: 'bg-tech-cyan/20' },
  view: { icon: Eye, color: 'tech-cyan', bgColor: 'bg-tech-cyan/20' }
};

const activityLabels = {
  article: '文章',
  comment: '评论',
  like: '点赞',
  view: '浏览'
};

type FilterType = 'all' | 'article' | 'comment' | 'like' | 'view';

export default function ActivityView() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(activity => activity.type === filter);

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (hours < 48) return '昨天';
    return `${date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="space-y-6">
      <GlassCard padding="lg" className="border-tech-cyan/20">
        {/* 过滤器 */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-tech-cyan flex-shrink-0" />
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(activityLabels) as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap
                  ${filter === type
                    ? 'bg-tech-cyan/20 text-tech-cyan shadow-lg'
                    : 'text-muted-foreground hover:bg-tech-cyan/10 hover:text-foreground'
                  }
                `}
              >
                {activityLabels[type]}
              </button>
            ))}
          </div>
        </div>

        {/* 活动列表 */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tech-cyan/10 flex items-center justify-center">
                <Filter className="w-8 h-8 text-tech-cyan" />
              </div>
              <p className="text-muted-foreground">暂无相关活动记录</p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type].icon;
              return (
                <div
                  key={activity.id}
                  className={`
                    group p-4 rounded-xl border border-tech-cyan/20
                    bg-[var(--card)]/40 hover:bg-tech-cyan/10
                    transition-all duration-300 hover:scale-[1.01] hover:shadow-lg
                    cursor-pointer animate-fade-in-up
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* 图标 */}
                    <div
                      className={`w-12 h-12 rounded-lg ${activityIcons[activity.type].bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 text-${activityIcons[activity.type].color}`} />
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground group-hover:text-tech-cyan transition-colors">
                          {activity.title}
                        </h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-tech-cyan/20 text-tech-cyan font-medium">
                          {activityLabels[activity.type]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 truncate">
                        {activity.description}
                      </p>

                      {/* 元数据 */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(activity.date)}
                        </span>
                        {activity.metadata?.views !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {activity.metadata.views}
                          </span>
                        )}
                        {activity.metadata?.likes !== undefined && (
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {activity.metadata.likes}
                          </span>
                        )}
                        {activity.metadata?.comments !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {activity.metadata.comments}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 箭头 */}
                    <div className="flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-tech-cyan group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 加载更多按钮 */}
        {filteredActivities.length > 0 && (
          <div className="text-center pt-6">
            <Button
              variant="ghost"
              className="text-tech-cyan hover:text-tech-lightcyan group inline-flex items-center gap-1"
            >
              加载更多
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
