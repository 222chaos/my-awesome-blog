'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Banner } from '@/types/music';

interface HeroBannerProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
}

export default function HeroBanner({ 
  banners, 
  autoPlay = true, 
  interval = 5000,
  showArrows = true,
  showIndicators = true 
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div 
      className="relative w-full h-90 rounded-3xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 transition-all duration-700 ease-out"
        style={{ backgroundImage: `url(${currentBanner.image})` }}
      />

      <div 
        className="absolute inset-0"
        style={{ background: currentBanner.gradient }}
      />

      <div className="relative z-10 flex h-full items-center px-8">
        <div className="flex-1 max-w-lg animate-slide-up">
          <h1 className="font-sf-pro-display text-title-1 mb-4 text-white">
            {currentBanner.title}
          </h1>
          <p className="font-sf-pro-text text-body text-white/80 mb-6">
            {currentBanner.subtitle}
          </p>
          {currentBanner.description && (
            <p className="font-sf-pro-text text-body text-white/60 mb-6">
              {currentBanner.description}
            </p>
          )}
          <button 
            className="bg-[#fa2d2f] text-white px-6 py-3 rounded-xl font-sf-pro-text text-body font-semibold hover:bg-[#ff3b30] transition-colors duration-200 cursor-pointer shadow-md"
          >
            立即播放
          </button>
        </div>

        {currentBanner.coverImage && (
          <div className="hidden lg:block w-50 h-50 perspective-1000 animate-scale-in">
            <div 
              className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 ease-out hover:scale-105"
              style={{
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)'
              }}
            >
              <img 
                src={currentBanner.coverImage} 
                alt="专辑封面"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {showArrows && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="上一张"
          >
            <span className="text-2xl">◀️</span>
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="下一张"
          >
            <span className="text-2xl">▶️</span>
          </button>
        </>
      )}

      {showIndicators && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'rounded-full transition-all duration-300',
                currentIndex === index ? 'w-2.5 h-2.5 bg-[#fa2d2f] scale-125' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              )}
              aria-label={`切换到第${index + 1}张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
