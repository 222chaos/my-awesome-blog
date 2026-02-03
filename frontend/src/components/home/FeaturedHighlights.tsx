'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Pin, Star, TrendingUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HighlightItem {
  id: string
  type: 'pinned' | 'featured' | 'achievement' | 'quick-link'
  title: string
  description?: string
  icon?: React.ReactNode
  link?: string
  badge?: string
  color?: string
}

const mockHighlights: HighlightItem[] = [
  {
    id: '1',
    type: 'pinned',
    title: '置顶文章',
    description: '深入理解React Server Components',
    icon: <Pin className="w-5 h-5" />,
    link: '/articles/pinned',
    badge: '热门',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: '2',
    type: 'featured',
    title: '精选内容',
    description: 'Next.js 14最佳实践指南',
    icon: <Star className="w-5 h-5" />,
    link: '/articles/featured',
    badge: '精选',
    color: 'from-tech-cyan to-tech-sky'
  },
  {
    id: '3',
    type: 'achievement',
    title: '最新成就',
    description: '完成100篇技术博客',
    icon: <TrendingUp className="w-5 h-5" />,
    link: '/achievements',
    badge: '里程碑',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '4',
    type: 'quick-link',
    title: '快速导航',
    description: '访问项目作品集',
    icon: <ArrowRight className="w-5 h-5" />,
    link: '/portfolio',
    badge: '推荐',
    color: 'from-green-500 to-emerald-500'
  }
]

export default function FeaturedHighlights() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockHighlights.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mockHighlights.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mockHighlights.length) % mockHighlights.length)
  }

  return (
    <section
      className="relative overflow-hidden py-4 sm:py-6 bg-gradient-to-b from-tech-darkblue to-transparent"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-tech-cyan to-tech-sky rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              精选推荐
            </h2>
          </div>
          <span className="text-xs text-gray-400">
            {currentIndex + 1} / {mockHighlights.length}
          </span>
        </div>

        <div className="relative">
          <div className="flex gap-4 overflow-hidden">
            {mockHighlights.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4',
                  'transition-all duration-500 ease-out transform',
                  index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none absolute'
                )}
              >
                <a
                  href={item.link}
                  className={cn(
                    'block h-full bg-glass/30 backdrop-blur-xl border border-glass-border rounded-lg',
                    'p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                    'cursor-pointer group'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                        'p-2 rounded-lg bg-gradient-to-br',
                        item.color || 'from-tech-cyan to-tech-sky',
                        'text-white'
                      )}
                    >
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/30'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-tech-cyan transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center text-tech-cyan text-sm font-medium">
                    <span>了解更多</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {mockHighlights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentIndex ? 'w-8 bg-tech-cyan' : 'w-2 bg-gray-600 hover:bg-gray-500'
                )}
                aria-label={`切换到第 ${index + 1} 个推荐`}
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 bg-glass/30 backdrop-blur-xl border border-glass-border rounded-full p-2 text-white hover:bg-glass/50 transition-colors opacity-0 hover:opacity-100"
            aria-label="上一个"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 bg-glass/30 backdrop-blur-xl border border-glass-border rounded-full p-2 text-white hover:bg-glass/50 transition-colors opacity-0 hover:opacity-100"
            aria-label="下一个"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
