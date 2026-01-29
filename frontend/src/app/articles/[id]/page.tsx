'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Calendar, Tag, User, Eye, MessageCircle, Share2, Bookmark, Heart, ArrowLeft } from 'lucide-react';
import { useThemeUtils } from '@/hooks/useThemeUtils';
import { getArticleById, getRelatedArticles } from '@/services/articleService';
import PostCard from '@/components/ui/PostCard';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
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
    bio?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  category: {
    name: string;
  };
  view_count: number;
}

// 将 RelatedArticle 转换为 Article 类型的辅助函数
const convertToArticle = (related: RelatedArticle): Article => {
  return {
    id: related.id,
    title: related.title,
    content: '',
    excerpt: related.excerpt,
    is_published: true,
    view_count: related.view_count,
    created_at: related.published_at,
    updated_at: related.published_at,
    published_at: related.published_at,
    author_id: '1',
    category_id: '1',
    featured_image: undefined,
    author: {
      id: '1',
      username: '作者',
      email: 'author@example.com',
      avatar: undefined,
      bio: undefined,
    },
    category: {
      id: '1',
      name: related.category.name,
      slug: 'category',
      description: '',
    },
    tags: [],
  };
};

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getThemeClass } = useThemeUtils();

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);
        const articleData = await getArticleById(params.id);
        if (!articleData) {
          notFound();
        }
        setArticle(articleData);

        // 获取相关文章
        const relatedData = await getRelatedArticles(params.id, articleData.category.id);
        setRelatedArticles(relatedData);
      } catch (err) {
        console.error('获取文章数据失败:', err);
        setError('获取文章数据失败');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticleData();
    }
  }, [params.id]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <h2 className={`text-2xl font-bold mb-4 ${accentClass}`}>错误</h2>
          <p className={getThemeClass('text-foreground/70', 'text-gray-600')}>{error}</p>
          <Link href="/articles" prefetch={false}>
            <Button className="mt-4">返回文章列表</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/articles" prefetch={false}>
          <Button variant="ghost" className={`mb-6 ${getThemeClass('text-foreground hover:text-tech-cyan', 'text-gray-800 hover:text-blue-600')}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回文章列表
          </Button>
        </Link>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        ) : article ? (
          <>
            {/* 文章头部 */}
            <div className="mb-8">
              <Badge variant="secondary" className={`mb-4 ${getThemeClass(
                'bg-tech-cyan/20 text-tech-cyan',
                'bg-blue-100 text-blue-800'
              )}`}>
                {article.category.name}
              </Badge>
              
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${textClass}`}>
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between pb-6 border-b border-dashed border-opacity-30">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{article.author.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>{article.view_count} 次阅读</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className={getThemeClass(
                    'border-glass-border hover:bg-glass/40 text-foreground',
                    'border-gray-300 hover:bg-gray-50 text-gray-800'
                  )}>
                    <Heart className="h-4 w-4 mr-2" />
                    点赞
                  </Button>
                  <Button variant="outline" size="sm" className={getThemeClass(
                    'border-glass-border hover:bg-glass/40 text-foreground',
                    'border-gray-300 hover:bg-gray-50 text-gray-800'
                  )}>
                    <Bookmark className="h-4 w-4 mr-2" />
                    收藏
                  </Button>
                  <Button variant="outline" size="sm" className={getThemeClass(
                    'border-glass-border hover:bg-glass/40 text-foreground',
                    'border-gray-300 hover:bg-gray-50 text-gray-800'
                  )}>
                    <Share2 className="h-4 w-4 mr-2" />
                    分享
                  </Button>
                </div>
              </div>
            </div>

            {/* 文章内容 */}
            <GlassCard className={`mb-8 p-6 md:p-8 ${cardBgClass}`}>
              <div className={`prose max-w-none ${getThemeClass('prose-invert', '')} ${textClass}`}>
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </GlassCard>

            {/* 标签 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>标签</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={getThemeClass(
                      'border-glass-border text-foreground/80',
                      'border-gray-300 text-gray-700'
                    )}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 作者信息 */}
            <GlassCard className={`mb-8 p-6 ${cardBgClass}`}>
              <div className="flex items-start">
                <div className="mr-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textClass}`}>{article.author.username}</h3>
                  <p className={getThemeClass('text-foreground/70', 'text-gray-600')}>
                    {article.author.bio || '暂无个人简介'}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* 相关文章 */}
            {relatedArticles.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-xl font-semibold mb-6 ${textClass}`}>相关文章</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((relatedArticle) => {
                    const articleForCard = convertToArticle(relatedArticle);
                    return (
                      <PostCard key={relatedArticle.id} article={articleForCard} />
                    );
                  })}
                </div>
              </div>
            )}

            {/* 评论区域 */}
            <GlassCard className={`p-6 ${cardBgClass}`}>
              <h3 className={`text-xl font-semibold mb-6 ${textClass}`}>评论</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium mb-1 ${textClass}`}>用户名</div>
                    <p className={getThemeClass('text-foreground/70', 'text-gray-600')}>
                      这是一条评论内容...
                    </p>
                    <div className="flex items-center mt-2 text-xs">
                      <span className={getThemeClass('text-foreground/50', 'text-gray-500')}>2023年10月12日</span>
                      <Button variant="ghost" size="sm" className={`ml-4 ${getThemeClass('text-foreground/70 hover:text-tech-cyan', 'text-gray-600 hover:text-blue-600')}`}>
                        <MessageCircle className="h-3 w-3 mr-1" />
                        回复
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="ml-14 flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm mb-1 ${textClass}`}>用户名</div>
                    <p className={getThemeClass('text-foreground/70', 'text-gray-600')}>
                      这是一条回复评论...
                    </p>
                    <div className="flex items-center mt-2 text-xs">
                      <span className={getThemeClass('text-foreground/50', 'text-gray-500')}>2023年10月12日</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <textarea
                    rows={4}
                    placeholder="写下你的评论..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      getThemeClass(
                        'bg-glass/20 border-glass-border text-foreground placeholder:text-foreground/50',
                        'bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500'
                      )
                    } focus:outline-none focus:ring-2 focus:ring-tech-cyan`}
                  ></textarea>
                  <div className="mt-4 flex justify-end">
                    <Button>发表评论</Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </>
        ) : null}
      </div>
    </div>
  );
}