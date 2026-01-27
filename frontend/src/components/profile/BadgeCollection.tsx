'use client';

import { useState } from 'react';
import { Award, Lock, Flame, PenTool, Heart, Star, Zap, Trophy, Target, Users, TrendingUp, FileText, Eye } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
  category: string;
}

const badges: Badge[] = [
  {
    id: 'first-post',
    name: '初出茅庐',
    description: '发布你的第一篇文章',
    icon: <PenTool className="w-5 h-5" />,
    color: 'bg-blue-500',
    unlocked: true,
    category: 'Writing'
  },
  {
    id: '10-posts',
    name: '勤奋写作',
    description: '累计发布 10 篇文章',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-green-500',
    unlocked: true,
    category: 'Writing'
  },
  {
    id: '50-posts',
    name: '写作达人',
    description: '累计发布 50 篇文章',
    icon: <PenTool className="w-5 h-5" />,
    color: 'bg-purple-500',
    unlocked: false,
    progress: 84,
    category: 'Writing'
  },
  {
    id: '100-likes',
    name: '受欢迎的作者',
    description: '文章累计获得 100 个赞',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-red-500',
    unlocked: true,
    category: 'Engagement'
  },
  {
    id: '1000-likes',
    name: '人气之星',
    description: '文章累计获得 1000 个赞',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-yellow-500',
    unlocked: false,
    progress: 234,
    category: 'Engagement'
  },
  {
    id: '10000-views',
    name: '阅读破万',
    description: '文章累计获得 10,000 次阅读',
    icon: <Eye className="w-5 h-5" />,
    color: 'bg-cyan-500',
    unlocked: true,
    category: 'Engagement'
  },
  {
    id: '30-days',
    name: '坚持一个月',
    description: '连续写作 30 天',
    icon: <Flame className="w-5 h-5" />,
    color: 'bg-orange-500',
    unlocked: true,
    category: 'Consistency'
  },
  {
    id: '100-days',
    name: '百日筑基',
    description: '连续写作 100 天',
    icon: <Trophy className="w-5 h-5" />,
    color: 'bg-amber-500',
    unlocked: false,
    progress: 45,
    category: 'Consistency'
  },
  {
    id: 'community',
    name: '社区贡献者',
    description: '回复评论达到 100 条',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-indigo-500',
    unlocked: false,
    progress: 86,
    category: 'Community'
  },
  {
    id: 'trending',
    name: '热门文章',
    description: '单篇文章阅读量超过 5000',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-rose-500',
    unlocked: true,
    category: 'Milestone'
  },
  {
    id: 'star',
    name: '明星作者',
    description: '单篇文章点赞数超过 500',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-pink-500',
    unlocked: false,
    progress: 420,
    category: 'Milestone'
  },
  {
    id: 'perfect',
    name: '完美主义',
    description: '连续 7 篇文章获得 10+ 赞',
    icon: <Award className="w-5 h-5" />,
    color: 'bg-emerald-500',
    unlocked: false,
    progress: 5,
    category: 'Quality'
  },
];

const categories = Array.from(new Set(badges.map(badge => badge.category)));

export default function BadgeCollection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const filteredBadges = selectedCategory === 'All'
    ? badges
    : badges.filter(badge => badge.category === selectedCategory);

  const unlockedCount = badges.filter(badge => badge.unlocked).length;
  const totalCount = badges.length;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Award className="w-4 h-4 text-primary" />
        成就徽章
      </h3>

      <GlassCard padding="lg" className="border-border">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                badge.unlocked
                  ? 'opacity-100'
                  : 'opacity-50'
              }`}
            >
              <GlassCard padding="md" className="border-border text-center">
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl ${badge.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 ${badge.unlocked ? '' : 'grayscale'}`}
                >
                  {badge.icon}
                </div>
                <div className="mt-3 space-y-1">
                  <div className={`font-medium text-foreground text-sm ${
                    badge.unlocked ? '' : 'line-through'
                  }`}>
                    {badge.name}
                  </div>
                  {!badge.unlocked && badge.progress !== undefined && (
                    <div className="text-xs text-muted-foreground">
                      {badge.progress}%
                    </div>
                  )}
                </div>
                {!badge.unlocked && (
                  <div className="absolute -top-1 -right-1">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </GlassCard>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">
              已解锁 <span className="font-semibold text-foreground">{unlockedCount}</span> / {totalCount} 个徽章
            </div>
            <div className="text-sm text-primary font-medium">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <GlassCard padding="lg" className="border-border max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div
                className={`w-20 h-20 mx-auto rounded-3xl ${selectedBadge.color} flex items-center justify-center text-white shadow-xl ${
                  selectedBadge.unlocked ? '' : 'grayscale'
                }`}
              >
                {selectedBadge.icon}
              </div>
              <div className="mt-4">
                <div className={`text-2xl font-bold text-foreground ${
                  selectedBadge.unlocked ? '' : 'line-through'
                }`}>
                  {selectedBadge.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedBadge.category}
                </div>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {selectedBadge.description}
              </p>
              {!selectedBadge.unlocked && selectedBadge.progress !== undefined && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">进度</span>
                    <span className="font-medium text-foreground">{selectedBadge.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500"
                      style={{ width: `${selectedBadge.progress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-6 w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 cursor-pointer"
              >
                关闭
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
