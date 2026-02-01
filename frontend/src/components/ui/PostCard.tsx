'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, Tag, User, Eye, MessageCircle, Heart, Bookmark, Clock, ThumbsUp, Image as ImageIcon } from 'lucide-react';
import { useThemedClasses } from '@/hooks/useThemedClasses';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  author_id: string;
  category_id: string;
  featured_image?: string;
  read_time: number; // 阅读时间（分钟）
  likes_count: number; // 点赞数
  comments_count: number; // 评论数
  shares_count: number; // 分享数
  author: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    reputation: number; // 声誉分数
    followers_count: number; // 关注者数量
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface PostCardProps {
  article: Article;
  className?: string;
}

export default function PostCard({ article, className = '' }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imgSrc, setImgSrc] = useState(article.featured_image || '/assets/avatar.jpg');

  const { themedClasses, getThemeClass } = useThemedClasses();

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 图片加载失败时的回调函数
  const handleError = () => {
    setImgSrc('/assets/avatar.jpg');
  };

  // 主题相关样式
  const cardBgClass = themedClasses.cardBgClass;
  const textClass = themedClasses.textClass;
  const accentClass = getThemeClass(
    'text-tech-cyan',
    'text-blue-600'
  );

  return (
    <Link href={`/articles/${article.id}`}>
      <div className={`group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl ${cardBgClass} ${className}`}>
        <div className="flex flex-col sm:flex-row">
          {/* 左侧封面图 */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                onError={handleError}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${getThemeClass('bg-glass/20', 'bg-gray-200')}`}>
                <ImageIcon className="h-12 w-12 text-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-tech-darkblue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* 右侧内容 */}
          <div className="flex-1 flex flex-col p-5 min-w-0 transition-transform duration-300 group-hover:translate-x-2">
            {/* 卡片头部 */}
            <div className="flex justify-between items-start mb-3 flex-shrink-0">
              <Badge variant="secondary" className={getThemeClass(
                'bg-tech-cyan/20 text-tech-cyan',
                'bg-blue-100 text-blue-800'
              )}>
                {article.category.name}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(article.published_at)}</span>
              </div>
            </div>

            {/* 标题 */}
            <h2 className={`text-lg font-bold mb-2 line-clamp-2 group-hover:${accentClass} transition-colors ${textClass}`}>
              {article.title}
            </h2>

            {/* 摘要 */}
            <p className={`mb-3 line-clamp-2 text-sm flex-1 ${themedClasses.mutedTextClass}`}>
              {article.excerpt}
            </p>

            {/* 标签 */}
            <div className="flex flex-wrap gap-1.5 mb-3 flex-shrink-0">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className={`text-xs ${getThemeClass(
                    'border-glass-border text-foreground/80',
                    'border-gray-300 text-gray-700'
                  )}`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>

            {/* 底部信息 */}
            <div className="flex items-center justify-between pt-3 border-t border-dashed border-opacity-30 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-sm">{article.view_count}</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">{article.likes_count}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{article.read_time} 分钟</span>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span className="text-sm">{article.author.username}</span>
              </div>
            </div>
          </div>
        </div>

            {/* 底部操作栏 */}
          <div className={`px-5 py-3 flex justify-between items-center border-t ${themedClasses.borderClass}`}>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`p-2 ${isLiked ? 'text-red-500' : getThemeClass('text-foreground/70 hover:text-red-500', 'text-gray-600 hover:text-red-500')}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
              className={`p-2 ${isBookmarked ? 'text-yellow-500' : getThemeClass('text-foreground/70 hover:text-yellow-500', 'text-gray-600 hover:text-yellow-500')}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <Button variant="outline" size="sm" className={getThemeClass(
            'text-foreground border-glass-border hover:bg-glass/40',
            'text-gray-800 border-gray-300 hover:bg-gray-50'
          )}>
            阅读全文
          </Button>
        </div>
      </div>
    </Link>
  );
}