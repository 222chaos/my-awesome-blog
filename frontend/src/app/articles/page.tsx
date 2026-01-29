'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Filter } from 'lucide-react';
import { useThemeUtils } from '@/hooks/useThemeUtils';
import { getArticles, getCategories, getTags } from '@/services/articleService';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
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
  const searchParams = useSearchParams();
  const { getThemeClass } = useThemeUtils();

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
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedTag, searchQuery]);

  // 处理筛选器变化
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleTagChange = (tagId: string | null) => {
    setSelectedTag(tagId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 清除筛选器
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery('');
  };

  // 主题相关样式
  const textClass = getThemeClass(
    'text-foreground',
    'text-gray-800'
  );

  const accentClass = getThemeClass(
    'text-tech-cyan',
    'text-blue-600'
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${accentClass}`}>文章中心</h1>
          <p className={`text-base md:text-lg ${getThemeClass('text-foreground/70', 'text-gray-600')}`}>
            探索技术前沿，分享开发心得
          </p>
        </div>

        {/* 搜索和筛选器 - 移动端折叠 */}
        <GlassCard className="mb-8 p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* 搜索框 */}
            <div className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full md:w-64 px-4 py-2.5 rounded-lg border ${
                    getThemeClass(
                      'bg-glass/20 border-glass-border text-foreground placeholder:text-foreground/50',
                      'bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500'
                    )
                  } focus:outline-none focus:ring-2 focus:ring-tech-cyan`}
                />
                <Search className={`absolute right-3 top-3 h-5 w-5 ${getThemeClass('text-foreground/50', 'text-gray-500')}`} />
              </div>
            </div>

            {/* 筛选按钮 - 移动端隐藏 */}
            <div className="hidden md:flex items-center gap-3">
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
                  全部
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
                    {category.name}
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
                  全部
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
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 移动端筛选按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden ${getThemeClass(
                'text-foreground border-glass-border hover:bg-glass/40',
                'text-gray-800 border-gray-300 hover:bg-gray-50'
              )}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
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
                    全部
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
                      {category.name}
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
                    全部
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
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 筛选器状态和清除按钮 */}
          {(selectedCategory || selectedTag || searchQuery) && (
            <div className="mt-4 flex items-center justify-between">
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
                清除筛选
              </Button>
            </div>
          )}
        </GlassCard>

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // 加载骨架屏
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 rounded-xl overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <PostCard key={article.id} article={article} />
            ))
          ) : (
            // 无结果时的提示
            <div className="col-span-full text-center py-16">
              <div className={`text-xl font-bold mb-2 ${accentClass}`}>暂无文章</div>
              <p className={getThemeClass('text-foreground/70', 'text-gray-600')}>
                {selectedCategory || selectedTag || searchQuery
                  ? '没有找到匹配的文章，请尝试其他筛选条件'
                  : '暂无文章发布，请稍后再来'}
              </p>
              {!selectedCategory && !selectedTag && !searchQuery && (
                <Button className="mt-4" onClick={clearFilters}>
                  刷新页面
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 分页组件 */}
        {articles.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                className={getThemeClass(
                  'text-foreground border-glass-border hover:bg-glass/40',
                  'text-gray-800 border-gray-300 hover:bg-gray-50'
                )}
              >
                上一页
              </Button>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? 'default' : 'outline'}
                    size="sm"
                    className={
                      page === 1
                        ? `${getThemeClass('bg-tech-cyan hover:bg-tech-cyan/90', 'bg-blue-600 hover:bg-blue-700')} text-white`
                        : getThemeClass(
                            'text-foreground border-glass-border hover:bg-glass/40',
                            'text-gray-800 border-gray-300 hover:bg-gray-50'
                          )
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className={getThemeClass(
                  'text-foreground border-glass-border hover:bg-glass/40',
                  'text-gray-800 border-gray-300 hover:bg-gray-50'
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