'use client';

import { useState } from 'react';
import { Award, Lock, Flame, PenTool, Heart, Star, Zap, Trophy, Target, Users, TrendingUp, FileText, Eye, Check } from 'lucide-react';
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
    color: 'from-blue-500 to-cyan-500',
    unlocked: true,
    category: 'Writing'
  },
  {
    id: '10-posts',
    name: '勤奋写作',
    description: '累计发布 10 篇文章',
    icon: <FileText className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
    unlocked: true,
    category: 'Writing'
  },
  {
    id: '50-posts',
    name: '写作达人',
    description: '累计发布 50 篇文章',
    icon: <PenTool className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
    unlocked: false,
    progress: 84,
    category: 'Writing'
  },
  {
    id: '100-likes',
    name: '受欢迎的作者',
    description: '文章累计获得 100 个赞',
    icon: <Heart className="w-5 h-5" />,
    color: 'from-red-500 to-rose-500',
    unlocked: true,
    category: 'Engagement'
  },
  {
    id: '1000-likes',
    name: '人气之星',
    description: '文章累计获得 1000 个赞',
    icon: <Star className="w-5 h-5" />,
    color: 'from-yellow-500 to-orange-500',
    unlocked: false,
    progress: 234,
    category: 'Engagement'
  },
  {
    id: '10000-views',
    name: '阅读破万',
    description: '文章累计获得 10,000 次阅读',
    icon: <Eye className="w-5 h-5" />,
    color: 'from-cyan-500 to-sky-500',
    unlocked: true,
    category: 'Engagement'
  },
  {
    id: '30-days',
    name: '坚持一个月',
    description: '连续写作 30 天',
    icon: <Flame className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
    unlocked: true,
    category: 'Consistency'
  },
  {
    id: '100-days',
    name: '百日筑基',
    description: '连续写作 100 天',
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-amber-500 to-yellow-500',
    unlocked: false,
    progress: 45,
    category: 'Consistency'
  },
  {
    id: 'community',
    name: '社区贡献者',
    description: '回复评论达到 100 条',
    icon: <Users className="w-5 h-5" />,
    color: 'from-indigo-500 to-purple-500',
    unlocked: false,
    progress: 86,
    category: 'Community'
  },
  {
    id: 'trending',
    name: '热门文章',
    description: '单篇文章阅读量超过 5000',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-rose-500 to-pink-500',
    unlocked: true,
    category: 'Milestone'
  },
  {
    id: 'star',
    name: '明星作者',
    description: '单篇文章点赞数超过 500',
    icon: <Star className="w-5 h-5" />,
    color: 'from-pink-500 to-fuchsia-500',
    unlocked: false,
    progress: 420,
    category: 'Milestone'
  },
  {
    id: 'perfect',
    name: '完美主义',
    description: '连续 7 篇文章获得 10+ 赞',
    icon: <Award className="w-5 h-5" />,
    color: 'from-emerald-500 to-green-500',
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
        <Award className="w-4 h-4 text-tech-cyan" />
        成就徽章
      </h3>

      <GlassCard padding="lg" className="border-tech-cyan/20">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-tech-cyan to-tech-sky text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-muted text-muted-foreground hover:bg-tech-cyan/10 hover:text-tech-cyan'
            }`}
          >
            全部
          </button>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer animate-fade-in-up ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-tech-cyan to-tech-sky text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-tech-cyan/10 hover:text-tech-cyan'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredBadges.map((badge, index) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative cursor-pointer transition-all duration-500 hover:scale-110 hover:-translate-y-1 animate-fade-in-up ${
                badge.unlocked ? 'opacity-100' : 'opacity-40'
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative">
                {/* 悬停光晕 */}
                <div className={`absolute -inset-3 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-500`} />
                
                {/* 卡片背景 */}
                <div className="relative bg-glass rounded-2xl p-4 border border-tech-cyan/10 group-hover:border-tech-cyan/40 transition-all duration-500">
                  {/* 徽章图标 */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 ${
                        badge.unlocked ? '' : 'grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    
                    {/* 未解锁锁定图标 */}
                    {!badge.unlocked && (
                      <div className="absolute -top-2 -right-2 p-1.5 bg-background rounded-full shadow-md animate-pulse">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* 徽章名称 */}
                  <div className="mt-3 space-y-1">
                    <div className={`font-semibold text-foreground text-sm ${
                      badge.unlocked ? '' : 'line-through'
                    }`}>
                      {badge.name}
                    </div>
                    
                    {/* 进度条 */}
                    {!badge.unlocked && badge.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-tech-cyan to-tech-sky rounded-full transition-all duration-500"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {badge.progress}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 进度统计 */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-muted-foreground">
              已解锁 <span className="font-bold text-gradient-primary text-lg ml-1">{unlockedCount}</span> / {totalCount} 个徽章
            </div>
            <div className="text-2xl font-bold text-tech-cyan">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-tech-cyan/0 via-tech-cyan/5 to-tech-cyan/0" />
            <div
              className="h-full bg-gradient-to-r from-tech-cyan via-tech-sky to-tech-cyan rounded-full transition-all duration-700 relative"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            >
              {/* 进度条光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 徽章详情弹窗 */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedBadge(null)}
        >
          <GlassCard
            padding="lg"
            className="border-tech-cyan/30 max-w-md w-full animate-scale-fade-in hover:shadow-[0_0_50px_var(--shadow-tech-cyan)] transition-shadow duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-5">
              {/* 徽章图标 */}
              <div className="relative inline-block">
                <div
                  className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${selectedBadge.color} flex items-center justify-center text-white shadow-2xl ${
                    selectedBadge.unlocked ? '' : 'grayscale'
                  }`}
                >
                  {selectedBadge.icon}
                </div>
                
                {/* 光晕效果 */}
                {selectedBadge.unlocked && (
                  <div className={`absolute -inset-4 bg-gradient-to-br ${selectedBadge.color} opacity-30 blur-2xl animate-pulse-glow`} />
                )}
              </div>
              
              {/* 徽章信息 */}
              <div>
                <div className={`text-2xl font-bold text-gradient-primary ${
                  selectedBadge.unlocked ? '' : 'line-through'
                }`}>
                  {selectedBadge.name}
                </div>
                <div className="text-sm text-tech-cyan font-medium mt-1">
                  {selectedBadge.category}
                </div>
              </div>
              
              {/* 描述 */}
              <p className="text-muted-foreground leading-relaxed">
                {selectedBadge.description}
              </p>
              
              {/* 进度 */}
              {!selectedBadge.unlocked && selectedBadge.progress !== undefined && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">解锁进度</span>
                    <span className="font-bold text-tech-cyan">{selectedBadge.progress}%</span>
                  </div>
                  <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-tech-cyan to-tech-sky rounded-full transition-all duration-500 relative"
                      style={{ width: `${selectedBadge.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 成功标识 */}
              {selectedBadge.unlocked && (
                <div className="flex items-center justify-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-full">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">已解锁</span>
                </div>
              )}
              
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 px-6 bg-gradient-to-r from-tech-cyan to-tech-sky hover:from-tech-cyan/90 hover:to-tech-sky/90 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
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

