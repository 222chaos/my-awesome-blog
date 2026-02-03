'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlitchText from '@/components/ui/GlitchText';
import { ParallaxScroll } from '@/components/ui/ParallaxScroll';
import { FocusCards } from '@/components/ui/FocusCards';
import MasonryGrid from '@/components/ui/MasonryGrid';
import { Album } from '@/types';
import Loader from '@/components/loading/Loader';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
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
          // Fallback data if API fails or returns empty
          console.warn('Using fallback data');
          setAlbums(getFallbackAlbums());
        }
      } catch (error) {
        console.error('获取相册数据失败:', error);
        setAlbums(getFallbackAlbums());
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const getFallbackAlbums = (): Album[] => [
    {
      id: '1',
      title: 'Neon City',
      description: 'Cyberpunk vibes and night lights.',
      coverImage: 'https://images.unsplash.com/photo-1555685812-4b943f3db990?q=80&w=2070&auto=format&fit=crop',
      date: '2023-11-01',
      featured: true,
      images: 12
    },
    {
      id: '2',
      title: 'Digital Nature',
      description: 'Where technology meets the wild.',
      coverImage: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1974&auto=format&fit=crop',
      date: '2023-10-15',
      featured: true,
      images: 8
    },
    {
      id: '3',
      title: 'Abstract Minds',
      description: 'Deep dive into abstract geometry.',
      coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
      date: '2023-09-20',
      featured: false,
      images: 15
    },
    {
      id: '4',
      title: 'Urban Exploration',
      description: 'Lost in the concrete jungle.',
      coverImage: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070&auto=format&fit=crop',
      date: '2023-08-10',
      featured: false,
      images: 20
    },
    {
      id: '5',
      title: 'Minimalist',
      description: 'Less is more.',
      coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop',
      date: '2023-07-05',
      featured: true,
      images: 10
    },
    {
      id: '6',
      title: 'Portraits',
      description: 'Faces of the future.',
      coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
      date: '2023-06-12',
      featured: false,
      images: 18
    }
  ];

  // Collect all images for the ParallaxScroll (simulated from covers for now)
  const allImages = albums.map(a => a.coverImage).concat(albums.map(a => a.coverImage)).concat(albums.map(a => a.coverImage)); // Duplicate to fill scroll

  // Generate mock images for selected album
  const getAlbumImages = (album: Album) => {
    return Array.from({ length: album.images }).map((_, i) => ({
      id: `${album.id}-${i}`,
      src: album.coverImage, // In real app, this would be different images
      alt: `${album.title} ${i}`,
      title: `${album.title} #${i + 1}`
    }));
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-tech-cyan selection:text-black">
      {/* 1. Hero Section with Glitch Text */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tech-deepblue/20 via-black to-black z-0" />
        <div className="z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <GlitchText text="CYBER" size="xl" className="block" />
            <GlitchText text="GALLERY" size="xl" className="block" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-tech-cyan/80 text-lg md:text-xl tracking-widest uppercase font-light"
          >
            Visual Archives // v2.0
          </motion.p>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-tech-cyan to-transparent" />
        </motion.div>
      </section>

      {/* 2. Featured Albums (Focus Cards) */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-16 px-4 md:px-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-2 text-white">
                ALBUM <span className="text-tech-cyan">COLLECTIONS</span>
              </h2>
              <p className="text-white/60 max-w-md">
                Curated moments from the digital frontier. Hover to focus.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-4xl font-mono text-white/20">01</p>
            </div>
          </div>
          
          <FocusCards 
            cards={albums} 
            onCardClick={(id) => {
              const album = albums.find(a => a.id === id);
              if (album) setSelectedAlbum(album);
            }} 
          />
        </div>
      </section>

      {/* 3. Visual Stream (Parallax Scroll) */}
      <section className="py-24 relative bg-neutral-950">
        <div className="container mx-auto px-4">
           <div className="flex items-end justify-between mb-8 px-4 md:px-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-2 text-white">
                VISUAL <span className="text-tech-cyan">STREAM</span>
              </h2>
              <p className="text-white/60 max-w-md">
                A continuous flow of captured memories.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-4xl font-mono text-white/20">02</p>
            </div>
          </div>
          <ParallaxScroll images={allImages} />
        </div>
      </section>

      {/* 4. Selected Album Overlay (Modal style) */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-black overflow-y-auto"
          >
            <div className="min-h-screen p-4 md:p-8">
              {/* Header */}
              <div className="sticky top-0 z-20 flex justify-between items-center mb-12 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <button 
                  onClick={() => setSelectedAlbum(null)}
                  className="flex items-center gap-2 text-white/80 hover:text-tech-cyan transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="uppercase tracking-wider text-sm">Back to Collections</span>
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">{selectedAlbum.title}</h2>
                  <p className="text-xs text-white/50 uppercase tracking-widest">{selectedAlbum.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedAlbum(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Album Content */}
              <div className="container mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                  <h1 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6">
                    {selectedAlbum.title.toUpperCase()}
                  </h1>
                  <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
                    {selectedAlbum.description}
                  </p>
                </div>

                <MasonryGrid 
                  images={getAlbumImages(selectedAlbum)} 
                  onImageClick={(img) => console.log('View image', img)} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumsPage;
