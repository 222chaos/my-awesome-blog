'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Filter, Search, Grid3X3, Film, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import ImageGallery from '@/components/ui/ImageGallery';
import ImageCarousel from '@/components/ui/ImageCarousel';

import { Album } from '@/types';



const AlbumsPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [loading, setLoading] = useState(true);

  // 获取相册数据
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('/api/albums');
        const result = await response.json();
        
        if (result.success) {
          setAlbums(result.data);
        } else {
          console.error('获取相册数据失败:', result.message);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('获取相册数据失败:', error);
        // 如果API调用失败，使用默认数据
        setAlbums([
          {
            id: '1',
            title: '城市夜景',
            description: '现代都市的夜晚美景摄影集',
            coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            date: '2023-10-15',
            featured: true,
            images: 24
          },
          {
            id: '2',
            title: '自然风光',
            description: '壮丽的自然景观摄影',
            coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            date: '2023-09-22',
            featured: false,
            images: 32
          },
          {
            id: '3',
            title: '人物肖像',
            description: '专业人像摄影作品',
            coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            date: '2023-08-30',
            featured: true,
            images: 18
          },
          {
            id: '4',
            title: '旅行记忆',
            description: '世界旅行中的美好瞬间',
            coverImage: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            date: '2023-07-18',
            featured: false,
            images: 42
          },
          {
            id: '5',
            title: '动物世界',
            description: '野生动物的精彩瞬间',
            coverImage: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            date: '2023-06-05',
            featured: true,
            images: 28
          },
          {
            id: '6',
            title: '美食摄影',
            description: '精致美食的视觉盛宴',
            coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
            date: '2023-05-12',
            featured: false,
            images: 15
          }
        ]);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  // 获取特定相册的详细信息
  const loadAlbumImages = async (albumId: string) => {
    try {
      // 这里可以调用API获取相册的详细信息
      const albumDetail = albums.find(album => album.id === albumId);
      setSelectedAlbum(albumDetail || null);
    } catch (error) {
      console.error('获取相册详情失败:', error);
    }
  };

  // 加载所有相册图片用于轮播模式
  const allImages = albums.flatMap(album => 
    Array.from({ length: 5 }, (_, i) => ({
      id: `${album.id}-${i}`,
      src: album.coverImage,
      alt: `${album.title} - 图片 ${i + 1}`,
      title: `${album.title} - 图片 ${i + 1}`,
      description: `这是${album.title}相册中的第${i + 1}张图片`,
      date: album.date
    }))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tech-darkblue via-tech-deepblue to-tech-cyan flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tech-cyan mb-4"></div>
          <p className="text-white">正在加载相册...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-darkblue via-tech-deepblue to-tech-cyan pb-16 pt-24">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center">
            <Camera className="mr-3" /> 我的相册
          </h1>
          <p className="text-xl text-tech-lightcyan max-w-2xl mx-auto">
            探索生活中的美好瞬间，用镜头记录难忘时刻
          </p>
        </motion.div>

        {/* 视图模式切换 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-glass-border bg-glass/30 backdrop-blur-xl p-1">
            <button
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-tech-cyan text-white shadow-md'
                  : 'text-white/80 hover:text-white'
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="inline mr-2 h-4 w-4" /> 网格视图
            </button>
            <button
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'carousel'
                  ? 'bg-tech-cyan text-white shadow-md'
                  : 'text-white/80 hover:text-white'
              )}
              onClick={() => setViewMode('carousel')}
            >
              <Film className="inline mr-2 h-4 w-4" /> 幻灯片
            </button>
          </div>
        </div>

        {/* 相册筛选器 */}
        <div className="mb-8 p-4 rounded-xl bg-glass/30 backdrop-blur-xl border border-glass-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <input
                type="text"
                placeholder="搜索相册..."
                className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-lg border border-glass-border text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan"
              />
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-tech-cyan/20 hover:bg-tech-cyan/30 rounded-lg border border-glass-border transition-all duration-300 flex items-center">
                <Star className="mr-2 h-4 w-4" /> 精选
              </button>
              <button className="px-4 py-2 bg-tech-cyan/20 hover:bg-tech-cyan/30 rounded-lg border border-glass-border transition-all duration-300 flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> 最新
              </button>
              <button className="px-4 py-2 bg-tech-cyan/20 hover:bg-tech-cyan/30 rounded-lg border border-glass-border transition-all duration-300 flex items-center">
                <Filter className="mr-2 h-4 w-4" /> 更多
              </button>
            </div>
          </div>
        </div>

        {/* 相册列表 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlassCard 
                  className="h-full cursor-pointer overflow-hidden group"
                  onClick={() => loadAlbumImages(album.id)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {album.featured && (
                      <div className="absolute top-3 right-3 bg-tech-cyan text-black text-xs font-bold px-2 py-1 rounded-full">
                        精选
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{album.title}</h3>
                        <p className="text-white/80 text-sm">{album.images} 张照片</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{album.title}</h3>
                    <p className="text-white/80 mb-2">{album.description}</p>
                    <div className="flex justify-between items-center text-white/60 text-sm">
                      <span>{album.date}</span>
                      <span>{album.images} 张照片</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mb-12">
            <ImageCarousel 
              images={allImages} 
              autoPlay={true} 
              interval={4000}
              className="mb-12"
            />
          </div>
        )}

        {/* 选择的相册详情 */}
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedAlbum.title}</h2>
              <button 
                className="text-tech-cyan hover:text-tech-lightcyan"
                onClick={() => setSelectedAlbum(null)}
              >
                关闭
              </button>
            </div>
            <ImageGallery 
              images={Array.from({ length: 12 }, (_, i) => ({
                id: `${selectedAlbum.id}-${i}`,
                src: selectedAlbum.coverImage,
                alt: `${selectedAlbum.title} - 图片 ${i + 1}`,
                title: `${selectedAlbum.title} - 图片 ${i + 1}`,
                description: `这是${selectedAlbum.title}相册中的第${i + 1}张图片`,
                date: selectedAlbum.date
              }))}
              columns={3}
              showLightbox={true}
              enableFilter={false}
              enableSearch={false}
            />
          </motion.div>
        )}

        {/* 特色相册部分 */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">精选相册</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {albums
              .filter(album => album.featured)
              .map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard className="group overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 relative">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 bg-tech-cyan text-black text-xs font-bold px-2 py-1 rounded-full">
                          精选
                        </div>
                      </div>
                      <div className="md:w-3/5 p-6 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-white mb-2">{album.title}</h3>
                        <p className="text-white/80 mb-4">{album.description}</p>
                        <div className="flex justify-between items-center text-white/60 text-sm mt-auto">
                          <span>{album.date}</span>
                          <span>{album.images} 张照片</span>
                        </div>
                        <button 
                          className="mt-4 self-start px-4 py-2 bg-tech-cyan/20 hover:bg-tech-cyan/30 rounded-lg border border-glass-border transition-all duration-300"
                          onClick={() => loadAlbumImages(album.id)}
                        >
                          查看相册
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumsPage;