'use client';

import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useThemedClasses } from '@/hooks/useThemedClasses';
import { getArticles, getCategories, getTags, getFeaturedArticles } from '@/services/articleService';
import { useLoading } from '@/context/loading-context';
import HoloCard from '@/components/articles/HoloCard';
import FeaturedCarousel from '@/components/articles/FeaturedCarousel';
import CommandBar from '@/components/articles/CommandBar';
import ArchiveDrawer from '@/components/articles/ArchiveDrawer';
import Loader from '@/components/loading/Loader';
import GlitchText from '@/components/ui/GlitchText';
import { FocusCards } from '@/components/ui/FocusCards';
import ArticleCardSkeleton from '@/components/articles/ArticleCardSkeleton';
import { Album } from '@/types';

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
  cover_image?: string;
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
    description: string;
    article_count: number;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    article_count: number;
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

const ARTICLES_PER_PAGE = 12;

function ArticlesPageContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { themedClasses, getThemeClass } = useThemedClasses();
  const { showLoading, hideLoading } = useLoading();
  const observerTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    const tagParam = searchParams?.get('tag');
    const searchParam = searchParams?.get('search');
    const viewParam = searchParams?.get('view');

    if (categoryParam) setSelectedCategory(categoryParam);
    if (tagParam) setSelectedTag(tagParam);
    if (searchParam) setSearchQuery(searchParam);
    if (viewParam === 'list' || viewParam === 'grid') {
      setViewMode(viewParam);
    }
  }, [searchParams]);

  const fetchArticles = useCallback(async (currentPage = 1, append = false) => {
    try {
      console.log('开始获取文章数据...');
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      showLoading();

      const articlesData = await getArticles({
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
        search: searchQuery || undefined,
        limit: ARTICLES_PER_PAGE,
        offset: (currentPage - 1) * ARTICLES_PER_PAGE,
      });
      console.log('获取到文章数据:', articlesData);

      if (append) {
        setArticles(prev => [...prev, ...articlesData]);
      } else {
        setArticles(articlesData);
        setVisibleCount(articlesData.length);
      }

      const categoriesData = await getCategories();
      console.log('获取到分类数据:', categoriesData);
      setCategories(categoriesData);

      const tagsData = await getTags();
      console.log('获取到标签数据:', tagsData);
      setTags(tagsData);

      if (currentPage === 1) {
        const featuredData = await getFeaturedArticles(5);
        console.log('获取到精选文章数据:', featuredData);
        setFeaturedArticles(featuredData || []);
      }

      setHasMore(articlesData.length >= ARTICLES_PER_PAGE);
    } catch (error) {
      console.error('获取数据失败:', error);
      setError(error instanceof Error ? error.message : '获取数据失败');
    } finally {
      hideLoading();
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, selectedTag, searchQuery, showLoading, hideLoading]);

  useEffect(() => {
    fetchArticles(1, false);
  }, [fetchArticles]);

  const handleCategoryChange = (categoryId: string | null) => {
    setPage(1);
    setArticles([]);
    setSelectedCategory(categoryId);
  };

  const handleTagChange = (tagId: string | null) => {
    setPage(1);
    setArticles([]);
    setSelectedTag(tagId);
  };

  const handleSearchChange = (query: string) => {
    setPage(1);
    setArticles([]);
    setSearchQuery(query);
  };

  const handleViewToggle = (view: 'grid' | 'list') => {
    setViewMode(view);
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage, true);
    }
  }, [page, loadingMore, hasMore, fetchArticles]);

  const handleScroll = useCallback(() => {
    if (!observerTargetRef.current || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8) {
      loadMore();
    }
  }, [loadMore, loadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  const getHotArticles = () => {
    return [...articles]
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 10);
  };

  const featuredArticleCount = featuredArticles.length;

  const mapToAlbums = (articles: Article[]): Album[] => {
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      coverImage: article.cover_image || '/assets/placeholder.svg',
      description: article.excerpt,
      date: article.published_at,
      featured: true,
      images: 0,
      slug: article.id
    }));
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-white font-sans selection:bg-[#EC4899] selection:text-white">
      <div className="relative">
        <div className="pt-20 pb-10 text-center">
          <GlitchText text="ARTICLES" size="lg" className="mb-4 font-display" />
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
            Explore the digital frontier
          </p>
        </div>

        {featuredArticleCount > 0 && (
          <div className="mb-16">
            <FocusCards cards={mapToAlbums(featuredArticles)} />
          </div>
        )}

        <div className="container mx-auto px-4 py-8 pb-32">
          <CommandBar
            categories={categories}
            tags={tags}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
            onSearchChange={handleSearchChange}
            onViewToggle={handleViewToggle}
            currentView={viewMode}
            onOpenDrawer={() => setDrawerOpen(true)}
          />

          <div className="mt-8">
            {error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className={`text-4xl font-bold mb-4 ${getThemeClass('text-red-500', 'text-red-600')}`}>
                  加载失败
                </div>
                <p className={`text-lg mb-6 ${getThemeClass('text-gray-400', 'text-gray-600')}`}>
                  {error}
                </p>
                <button
                  onClick={() => fetchArticles(1, false)}
                  className={`px-6 py-3 rounded-lg font-medium ${getThemeClass(
                    'bg-tech-cyan text-white hover:bg-tech-lightcyan',
                    'bg-blue-600 text-white hover:bg-blue-700'
                  )}`}
                >
                  重新加载
                </button>
              </motion.div>
            ) : loading ? (
              <div className={viewMode === 'grid'
                ? 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'
                : 'space-y-6'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} variant={i % 3 === 0 ? 'tall' : i % 3 === 1 ? 'short' : 'default'} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={viewMode === 'grid'
                    ? 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'
                    : 'space-y-6'
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {articles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="break-inside-avoid mb-6"
                      >
                        <HoloCard
                          article={article}
                          isFeatured={false}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {hasMore && (
                  <div ref={observerTargetRef} className="py-8 text-center">
                    {loadingMore ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader />
                        <span className="text-sm text-gray-400">加载更多...</span>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadMore}
                        className={`px-8 py-4 rounded-xl font-medium ${getThemeClass(
                          'bg-tech-cyan text-white hover:bg-tech-lightcyan',
                          'bg-blue-600 text-white hover:bg-blue-700'
                        )}`}
                      >
                        加载更多 ({visibleCount}/{articles.length})
                      </motion.button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className={`text-4xl font-bold mb-4 ${getThemeClass('text-tech-cyan', 'text-tech-cyan')}`}>
                  暂无文章
                </div>
                <p className={`text-lg ${getThemeClass('text-gray-400', 'text-gray-600')}`}>
                  {selectedCategory || selectedTag || searchQuery
                    ? '没有找到匹配的文章，请尝试其他筛选条件'
                    : '暂无文章发布，请稍后再来'}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <ArchiveDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          categories={categories}
          tags={tags}
          hotArticles={getHotArticles()}
          onCategorySelect={handleCategoryChange}
          onTagSelect={handleTagChange}
        />

        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">加载中...</div>}>
      <ArticlesPageContent />
    </Suspense>
  );
}
