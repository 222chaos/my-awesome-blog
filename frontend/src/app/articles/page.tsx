'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Filter, TrendingUp, Menu, X } from 'lucide-react';
import { useThemedClasses } from '@/hooks/useThemedClasses';
import { getArticles, getCategories, getTags } from '@/services/articleService';
import { useLoading } from '@/context/loading-context';
import PostCard from '@/components/ui/PostCard';
import ArticleSidebar from './components/ArticleSidebar';
import MediaPlayer from '@/components/ui/MediaPlayer';

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
  read_time: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  author: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    reputation: number;
    followers_count: number;
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
  article_count: number;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  article_count: number;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const searchParams = useSearchParams();
  const { themedClasses, getThemeClass } = useThemedClasses();
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
        const articlesData = await getArticles({
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          search: searchQuery || undefined,
        });
        setArticles(articlesData);

        const categoriesData = await getCategories();
        setCategories(categoriesData);

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

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setShowMobileSidebar(false);
  };

  const handleTagChange = (tagId: string | null) => {
    setSelectedTag(tagId);
    setCurrentPage(1);
    setShowMobileSidebar(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption: 'newest' | 'popular' | 'trending') => {
    setSortBy(sortOption);
    setCurrentPage(1);
  };

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
      const scoreA = (a.likes_count * 2 + a.comments_count * 1.5) /
                    Math.max(1, (Date.now() - new Date(a.published_at).getTime()) / (1000 * 60 * 60 * 24));
      const scoreB = (b.likes_count * 2 + b.comments_count * 1.5) /
                    Math.max(1, (Date.now() - new Date(b.published_at).getTime()) / (1000 * 60 * 60 * 24));
      return scoreB - scoreA;
    }
    return 0;
  });

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const textClass = themedClasses.textClass;
  const accentClass = getThemeClass(
    'text-tech-cyan',
    'text-blue-600'
  );

  const mutedTextClass = themedClasses.mutedTextClass;

  return (
    <div className="min-h-screen bg-background relative">
      {/* 媒体播放组件 - 使用绝对定位紧贴浏览器顶部 */}
      <div className="h-[25vh] overflow-hidden absolute top-0 left-0 right-0 z-10 -mt-16 sm:-mt-14 lg:-mt-16">
        <MediaPlayer
          mediaItems={[
            {
              type: 'video',
              src: '/video/falling-star-sky-lake-silhouette-live-wallpaper.mp4',
              alt: '星空湖景动态壁纸',
              caption: '星空湖景动态壁纸'
            }
          ]}
          autoPlay={true}
          aspectRatio="aspect-[4/1]"
        />
      </div>

      <div className="max-w-7xl mx-auto pt-40"> {/* 增加顶部填充以避免内容被媒体组件遮挡 */}

        {/* 搜索和排序栏 */}
        <GlassCard className="mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* 搜索框 */}
            <div className="w-full sm:w-auto flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索文章标题、内容或标签..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    getThemeClass(
                      'bg-glass/20 border-glass-border text-foreground placeholder:text-foreground/50',
                      'bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500'
                    )
                  } focus:outline-none focus:ring-2 focus:ring-tech-cyan`}
                />
                <Search className={`absolute right-3 top-3 h-5 w-5 ${getThemeClass('text-foreground/50', 'text-gray-500')}`} />
              </div>
            </div>

            {/* 移动端侧边栏切换按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden"
            >
              {showMobileSidebar ? <X className="h-4 w-4 mr-2" /> : <Menu className="h-4 w-4 mr-2" />}
              {showMobileSidebar ? '收起' : '筛选'}
            </Button>

            {/* 排序选项 */}
            <div className="hidden sm:flex items-center gap-2">
              <span className={`text-sm ${mutedTextClass}`}>排序:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
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
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
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
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
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
          </div>

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

          {/* 移动端排序选项 */}
          <div className="sm:hidden mt-4">
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
        </GlassCard>

        {/* 主内容区 - 左右双列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧主内容区 - 文章列表 */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              // 加载骨架屏
              Array.from({ length: articlesPerPage }).map((_, index) => (
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
                  </div>
                </div>
              ))
            ) : currentArticles.length > 0 ? (
              <div className="space-y-6">
                {currentArticles.map((article) => (
                  <PostCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
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

            {/* 分页组件 */}
            {articles.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
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

          {/* 右侧边栏 */}
          <aside className={`lg:col-span-4 ${showMobileSidebar ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-6 space-y-6">
              <ArticleSidebar
                categories={categories}
                tags={tags}
                articles={articles}
                selectedCategory={selectedCategory}
                selectedTag={selectedTag}
                onCategorySelect={handleCategoryChange}
                onTagSelect={handleTagChange}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
