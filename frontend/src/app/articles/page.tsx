'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Filter, TrendingUp, Clock, Eye, MessageCircle, ThumbsUp, Star, Users } from 'lucide-react';
import { useThemeUtils } from '@/hooks/useThemeUtils';
import { getArticles, getCategories, getTags } from '@/services/articleService';
import { useLoading } from '@/context/loading-context';
import PostCard from '@/components/ui/PostCard';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  article_count: number; // 分类文章数量
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  article_count: number; // 标签文章数量
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;
  const searchParams = useSearchParams();
  const { getThemeClass } = useThemeUtils();
  const { showLoading, hideLoading } = useLoading();

  // 获取搜索参数
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    const tagParam = searchParams?.get('tag');
    if (categoryParam) setSelectedCategory(categoryParam);
    if (tagParam) setSelectedTag(tagParam);
  }, [searchParams]);

  // 获取文章数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoading();
        // 获取文章列表
        const articlesData = await getArticles({
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          search: searchQuery || undefined,
        });
        setArticles(articlesData);

        // 获取分类列表
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // 获取标签列表
        const tagsData = await getTags();
        setTags(tagsData);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        hideLoading();
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  // 处理筛选器变化
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // 重置到第一页
  };

  const handleTagChange = (tagId: string | null) => {
    setSelectedTag(tagId);
    setCurrentPage(1); // 重置到第一页
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  const handleSortChange = (sortOption: 'newest' | 'popular' | 'trending') => {
    setSortBy(sortOption);
    setCurrentPage(1); // 重置到第一页
  };

  // 清除筛选器
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // 分页计算
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  let currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  // 根据排序选项排序文章
  currentArticles = [...currentArticles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    } else if (sortBy === 'popular') {
      return b.view_count - a.view_count;
    } else if (sortBy === 'trending') {
      // 趋势算法：考虑点赞数、评论数和发布时间
      const scoreA = (a.likes_count * 2 + a.comments_count * 1.5) /
                    Math.max(1, (Date.now() - new Date(a.published_at).getTime()) / (1000 * 60 * 60 * 24));
      const scoreB = (b.likes_count * 2 + b.comments_count * 1.5) /
                    Math.max(1, (Date.now() - new Date(b.published_at).getTime()) / (1000 * 60 * 60 * 24));
      return scoreB - scoreA;
    }
    return 0;
  });

  // 分页总数
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  // 主题相关样式
  const textClass = getThemeClass(
    'text-foreground',
    'text-gray-800'
  );

  const accentClass = getThemeClass(
    'text-tech-cyan',
    'text-blue-600'
  );

  const mutedTextClass = getThemeClass(
    'text-foreground/70',
    'text-gray-600'
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题和副标题 */}
        <div className="text-center mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${accentClass}`}>文章中心</h1>
          <p className={`text-base md:text-lg ${mutedTextClass}`}>
            探索技术前沿，分享开发心得，发现创新灵感
          </p>
        </div>

        {/* 统计卡片行 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className={`p-4 text-center ${getThemeClass(
            'bg-glass/30 backdrop-blur-xl border border-glass-border',
            'bg-white/80 backdrop-blur-xl border border-gray-200'
          )}`}>
            <div className="flex items-center justify-center">
              <Users className="h-6 w-6 mr-2 text-tech-cyan" />
              <span className="text-2xl font-bold">{articles.length}</span>
            </div>
            <p className={`text-sm ${mutedTextClass}`}>文章总数</p>
          </GlassCard>

          <GlassCard className={`p-4 text-center ${getThemeClass(
            'bg-glass/30 backdrop-blur-xl border border-glass-border',
            'bg-white/80 backdrop-blur-xl border border-gray-200'
          )}`}>
            <div className="flex items-center justify-center">
              <Eye className="h-6 w-6 mr-2 text-tech-cyan" />
              <span className="text-2xl font-bold">{articles.reduce((sum, article) => sum + article.view_count, 0)}</span>
            </div>
            <p className={`text-sm ${mutedTextClass}`}>总阅读量</p>
          </GlassCard>

          <GlassCard className={`p-4 text-center ${getThemeClass(
            'bg-glass/30 backdrop-blur-xl border border-glass-border',
            'bg-white/80 backdrop-blur-xl border border-gray-200'
          )}`}>
            <div className="flex items-center justify-center">
              <ThumbsUp className="h-6 w-6 mr-2 text-tech-cyan" />
              <span className="text-2xl font-bold">{articles.reduce((sum, article) => sum + article.likes_count, 0)}</span>
            </div>
            <p className={`text-sm ${mutedTextClass}`}>总点赞数</p>
          </GlassCard>

          <GlassCard className={`p-4 text-center ${getThemeClass(
            'bg-glass/30 backdrop-blur-xl border border-glass-border',
            'bg-white/80 backdrop-blur-xl border border-gray-200'
          )}`}>
            <div className="flex items-center justify-center">
              <MessageCircle className="h-6 w-6 mr-2 text-tech-cyan" />
              <span className="text-2xl font-bold">{articles.reduce((sum, article) => sum + article.comments_count, 0)}</span>
            </div>
            <p className={`text-sm ${mutedTextClass}`}>总评论数</p>
          </GlassCard>
        </div>

        {/* 搜索、筛选和排序行 */}
        <GlassCard className="mb-8 p-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* 搜索框 */}
            <div className="w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索文章标题、内容或标签..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full lg:w-64 px-4 py-2.5 rounded-lg border ${
                    getThemeClass(
                      'bg-glass/20 border-glass-border text-foreground placeholder:text-foreground/50',
                      'bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500'
                    )
                  } focus:outline-none focus:ring-2 focus:ring-tech-cyan`}
                />
                <Search className={`absolute right-3 top-3 h-5 w-5 ${getThemeClass('text-foreground/50', 'text-gray-500')}`} />
              </div>
            </div>

            {/* 排序选项 - 桌面端 */}
            <div className="hidden md:flex items-center gap-2">
              <span className={`text-sm ${mutedTextClass}`}>排序:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    sortBy === 'newest'
                      ? 'bg-tech-cyan text-white'
                      : getThemeClass(
                          'bg-glass/20 text-foreground hover:bg-glass/40',
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        )
                  }`}
                >
                  最新
                </button>
                <button
                  onClick={() => handleSortChange('popular')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    sortBy === 'popular'
                      ? 'bg-tech-cyan text-white'
                      : getThemeClass(
                          'bg-glass/20 text-foreground hover:bg-glass/40',
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        )
                  }`}
                >
                  热门
                </button>
                <button
                  onClick={() => handleSortChange('trending')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    sortBy === 'trending'
                      ? 'bg-tech-cyan text-white'
                      : getThemeClass(
                          'bg-glass/20 text-foreground hover:bg-glass/40',
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        )
                  }`}
                >
                  趋势
                </button>
              </div>
            </div>

            {/* 筛选按钮 - 桌面端隐藏 */}
            <div className="hidden md:flex items-center gap-3 flex-wrap">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    !selectedCategory
                      ? 'bg-tech-cyan text-white'
                      : getThemeClass(
                          'bg-glass/20 text-foreground hover:bg-glass/40',
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        )
                  }`}
                >
                  全部分类
                </button>
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === category.id
                        ? 'bg-tech-cyan text-white'
                        : getThemeClass(
                            'bg-glass/20 text-foreground hover:bg-glass/40',
                            'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          )
                    }`}
                  >
                    {category.name} ({category.article_count})
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagChange(null)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    !selectedTag
                      ? 'bg-tech-cyan text-white'
                      : getThemeClass(
                          'bg-glass/20 text-foreground hover:bg-glass/40',
                          'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        )
                  }`}
                >
                  全部标签
                </button>
                {tags.slice(0, 5).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagChange(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedTag === tag.id
                        ? 'bg-tech-cyan text-white'
                        : getThemeClass(
                            'bg-glass/20 text-foreground hover:bg-glass/40',
                            'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          )
                    }`}
                  >
                    {tag.name} ({tag.article_count})
                  </button>
                ))}
              </div>
            </div>

            {/* 移动端筛选按钮 */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`md:hidden w-full ${getThemeClass(
                  'text-foreground border-glass-border hover:bg-glass/40',
                  'text-gray-800 border-gray-300 hover:bg-gray-50'
                )}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>

              {/* 移动端排序选项 */}
              <div className="md:hidden w-full mt-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    getThemeClass(
                      'bg-glass/20 border-glass-border text-foreground',
                      'bg-white/80 border-gray-300 text-gray-800'
                    )
                  } focus:outline-none focus:ring-2 focus:ring-tech-cyan`}
                >
                  <option value="newest">最新</option>
                  <option value="popular">热门</option>
                  <option value="trending">趋势</option>
                </select>
              </div>
            </div>
          </div>

          {/* 移动端筛选器展开区域 */}
          {showFilters && (
            <div className="mt-4 md:hidden">
              <div className="mb-4">
                <h3 className={`text-sm font-medium mb-2 ${textClass}`}>分类</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      !selectedCategory
                        ? 'bg-tech-cyan text-white'
                        : getThemeClass(
                            'bg-glass/20 text-foreground hover:bg-glass/40',
                            'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          )
                    }`}
                  >
                    全部分类
                  </button>
                  {categories.slice(0, 5).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedCategory === category.id
                          ? 'bg-tech-cyan text-white'
                          : getThemeClass(
                              'bg-glass/20 text-foreground hover:bg-glass/40',
                              'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            )
                      }`}
                    >
                      {category.name} ({category.article_count})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-medium mb-2 ${textClass}`}>标签</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTagChange(null)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      !selectedTag
                        ? 'bg-tech-cyan text-white'
                        : getThemeClass(
                            'bg-glass/20 text-foreground hover:bg-glass/40',
                            'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          )
                    }`}
                  >
                    全部标签
                  </button>
                  {tags.slice(0, 5).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagChange(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedTag === tag.id
                          ? 'bg-tech-cyan text-white'
                          : getThemeClass(
                              'bg-glass/20 text-foreground hover:bg-glass/40',
                              'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            )
                      }`}
                    >
                      {tag.name} ({tag.article_count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 筛选器状态和清除按钮 */}
          {(selectedCategory || selectedTag || searchQuery || sortBy !== 'newest') && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span>分类: {categories.find(c => c.id === selectedCategory)?.name}</span>
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedTag && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span>标签: {tags.find(t => t.id === selectedTag)?.name}</span>
                    <button
                      onClick={() => handleTagChange(null)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span>搜索: {searchQuery}</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {sortBy !== 'newest' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <span>排序: {sortBy === 'popular' ? '热门' : sortBy === 'trending' ? '趋势' : '最新'}</span>
                    <button
                      onClick={() => handleSortChange('newest')}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className={getThemeClass(
                  'text-foreground border-glass-border hover:bg-glass/40',
                  'text-gray-800 border-gray-300 hover:bg-gray-50'
                )}
              >
                清除全部
              </Button>
            </div>
          )}
        </GlassCard>

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // 加载骨架屏
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 rounded-xl overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : currentArticles.length > 0 ? (
            currentArticles.map((article) => (
              <PostCard key={article.id} article={article} />
            ))
          ) : (
            // 无结果时的提示
            <div className="col-span-full text-center py-16">
              <div className={`text-xl font-bold mb-2 ${accentClass}`}>暂无文章</div>
              <p className={mutedTextClass}>
                {selectedCategory || selectedTag || searchQuery
                  ? '没有找到匹配的文章，请尝试其他筛选条件'
                  : '暂无文章发布，请稍后再来'}
              </p>
              {!selectedCategory && !selectedTag && !searchQuery && (
                <Button className="mt-4" onClick={clearFilters}>
                  浏览全部文章
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 分页组件 */}
        {articles.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={getThemeClass(
                  'text-foreground border-glass-border hover:bg-glass/40 disabled:opacity-50',
                  'text-gray-800 border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                )}
              >
                上一页
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        currentPage === pageNum
                          ? `${getThemeClass('bg-tech-cyan hover:bg-tech-cyan/90', 'bg-blue-600 hover:bg-blue-700')} text-white`
                          : getThemeClass(
                              'text-foreground border-glass-border hover:bg-glass/40',
                              'text-gray-800 border-gray-300 hover:bg-gray-50'
                            )
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={getThemeClass(
                  'text-foreground border-glass-border hover:bg-glass/40 disabled:opacity-50',
                  'text-gray-800 border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                )}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}