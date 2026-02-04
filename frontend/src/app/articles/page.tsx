'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
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

function ArticlesPageContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchParams = useSearchParams();
  const { themedClasses, getThemeClass } = useThemedClasses();
  const { showLoading, hideLoading } = useLoading();

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

        const featuredData = await getFeaturedArticles(5);
        setFeaturedArticles(featuredData || []);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        hideLoading();
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedTag, searchQuery]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleTagChange = (tagId: string | null) => {
    setSelectedTag(tagId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewToggle = (view: 'grid' | 'list') => {
    setViewMode(view);
  };

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
      coverImage: article.featured_image || '/assets/placeholder.jpg',
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
            {loading ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid aspect-[4/5] rounded-2xl bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : articles.length > 0 ? (
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
                        isFeatured={false} // In masonry, we might not want large cards, or we can handle it
                        className="w-full"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
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
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">加载中...</div>}>
      <ArticlesPageContent />
    </Suspense>
  );
}
