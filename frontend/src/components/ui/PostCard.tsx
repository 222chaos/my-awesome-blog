'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, Tag, User, Eye, MessageCircle, Heart, Bookmark } from 'lucide-react';
import { useThemeUtils } from '@/hooks/useThemeUtils';

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
  author: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
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
  const { getThemeClass } = useThemeUtils();

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 主题相关样式
  const cardBgClass = getThemeClass(
    'bg-glass/30 backdrop-blur-xl border border-glass-border',
    'bg-white/80 backdrop-blur-xl border border-gray-200'
  );

  const textClass = getThemeClass(
    'text-foreground',
    'text-gray-800'
  );

  const accentClass = getThemeClass(
    'text-tech-cyan',
    'text-blue-600'
  );

  return (
    <Link href={`/articles/${article.id}`}>
      <div className={`group overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBgClass} ${className}`}>
        {/* 卡片头部 */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
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
          <p className={`mb-4 line-clamp-3 text-sm ${getThemeClass('text-foreground/70', 'text-gray-600')}`}>
            {article.excerpt}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
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
          <div className="flex items-center justify-between pt-3 border-t border-dashed border-opacity-30">
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-sm">{article.view_count}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">评论数</span>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">{article.author.username}</span>
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className={`px-5 py-3 flex justify-between items-center border-t ${getThemeClass('border-glass-border', 'border-gray-200')}`}>
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