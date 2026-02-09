'use client'

import { motion } from 'framer-motion'
import { Pin, Star, TrendingUp, ArrowRight, Eye, Heart, Flame, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HighlightItem {
  id: string
  type: 'pinned' | 'featured' | 'trending' | 'latest'
  title: string
  description: string
  icon: React.ReactNode
  link: string
  badge: string
  color: string
  stats: {
    views?: number
    likes?: number
    comments?: number
  }
  category?: string
  readTime?: string
}

const mockHighlights: HighlightItem[] = [
  {
    id: '1',
    type: 'pinned',
    title: '深入理解 React Server Components',
    description: '探索 Next.js 14 中 Server Components 的核心概念、最佳实践和性能优化技巧。',
    icon: <Pin className="w-5 h-5" />,
    link: '/articles/react-server-components',
    badge: '置顶',
    color: 'from-red-500 to-orange-500',
    category: 'React',
    readTime: '15 min',
    stats: {
      views: 12580,
      likes: 892,
      comments: 156
    }
  },
  {
    id: '2',
    type: 'featured',
    title: 'Next.js 14 最佳实践指南',
    description: '全面介绍 Next.js 14 的新特性、架构设计模式和生产环境部署策略。',
    icon: <Star className="w-5 h-5" />,
    link: '/articles/nextjs-best-practices',
    badge: '精选',
    color: 'from-tech-cyan to-tech-sky',
    category: 'Next.js',
    readTime: '20 min',
    stats: {
      views: 8932,
      likes: 654,
      comments: 89
    }
  },
  {
    id: '3',
    type: 'trending',
    title: 'TypeScript 高级类型系统',
    description: '深入掌握 TypeScript 高级类型、泛型、条件类型和工具类型的使用技巧。',
    icon: <Flame className="w-5 h-5" />,
    link: '/articles/typescript-advanced-types',
    badge: '热门',
    color: 'from-purple-500 to-pink-500',
    category: 'TypeScript',
    readTime: '18 min',
    stats: {
      views: 15234,
      likes: 1245,
      comments: 234
    }
  },
  {
    id: '4',
    type: 'latest',
    title: '全栈开发实战：从零到一',
    description: '使用 Next.js、FastAPI 和 PostgreSQL 构建完整的全栈应用程序。',
    icon: <TrendingUp className="w-5 h-5" />,
    link: '/articles/fullstack-development',
    badge: '最新',
    color: 'from-green-500 to-emerald-500',
    category: '全栈',
    readTime: '25 min',
    stats: {
      views: 3456,
      likes: 234,
      comments: 45
    }
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4
    }
  }
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

export default function FeaturedHighlights() {
  return (
    <section className="relative overflow-hidden py-6 sm:py-8 lg:py-10 bg-gradient-to-b from-tech-darkblue to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-7 sm:h-8 bg-gradient-to-b from-tech-cyan to-tech-sky rounded-full animate-pulse-glow" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              精选推荐
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-glass-border/50 to-transparent" />
          <span className="text-xs sm:text-sm text-gray-400">
            {mockHighlights.length} 篇精选
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {mockHighlights.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <a
                href={item.link}
                className={cn(
                  'block h-full bg-glass/30 backdrop-blur-xl border border-glass-border rounded-2xl',
                  'p-5 sm:p-6 transition-all duration-300',
                  'hover:shadow-2xl hover:shadow-tech-cyan/10',
                  'cursor-pointer relative overflow-hidden',
                  'before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none',
                  'before:bg-gradient-to-br before:from-white/5 before:to-transparent',
                  'group-hover:before:from-white/10'
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={cn(
                        'p-3 rounded-xl bg-gradient-to-br',
                        item.color,
                        'text-white shadow-lg'
                      )}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={cn(
                          'px-2.5 py-1 text-xs font-semibold rounded-full',
                          'bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/30',
                          'shadow-sm'
                        )}
                      >
                        {item.badge}
                      </span>
                      {item.category && (
                        <span className="text-[10px] sm:text-xs text-gray-400 bg-glass/50 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-tech-cyan transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {item.readTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.readTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-glass-border/50">
                      <div className="flex items-center gap-3">
                        {item.stats.views && (
                          <div className="flex items-center gap-1 group-hover:text-tech-cyan transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{formatNumber(item.stats.views)}</span>
                          </div>
                        )}
                        {item.stats.likes && (
                          <div className="flex items-center gap-1 group-hover:text-pink-400 transition-colors">
                            <Heart className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{formatNumber(item.stats.likes)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center text-tech-cyan text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                        <span className="text-xs sm:text-sm">阅读</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-tech-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-10 text-center"
        >
          <a
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-glass/30 backdrop-blur-xl border border-glass-border rounded-full text-white hover:bg-glass/50 hover:border-tech-cyan/50 hover:shadow-lg hover:shadow-tech-cyan/10 transition-all duration-300 cursor-pointer group"
          >
            <span className="text-sm sm:text-base font-medium">查看更多精选</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
